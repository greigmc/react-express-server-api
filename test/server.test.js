import request from "supertest";
import nock from "nock";
import app from "../server/server.js";
import validateEnvironment from "../server/middleware/validateEnv.js";


// Set up test environment variables
beforeAll(() => {
    process.env.VITE_API_USERS = "https://reqres.in/api/users?page=2";
    process.env.VITE_API_LOGIN = "https://dummyjson.com/auth/login";
    process.env.VITE_API_BEARER_TOKEN = "https://dummyjson.com/user/me";

    // Mock health check endpoint
    nock("https://reqres.in")
        .get("/api/users?page=2")
        .reply(200, {
            data: [{
                id: 1,
                first_name: "John",
                last_name: "Doe"
            }]
        });

    // Mock users endpoint
    nock("https://reqres.in")
        .get("/api/users?page=2")
        .reply(200, {
            data: [{
                    id: 1,
                    first_name: "John",
                    last_name: "Doe"
                },
                {
                    id: 2,
                    first_name: "Jane",
                    last_name: "Smith"
                }
            ]
        });

    // Mock login endpoint
    nock("https://dummyjson.com")
        .post("/auth/login", {
            username: "emilys",
            password: "emilyspass"
        })
        .reply(200, {
            token: "mockToken123"
        });

    // Mock bearer token endpoint
    nock("https://dummyjson.com")
        .get("/user/me")
        .reply(200, {
            id: 1,
            username: "mockUser",
            email: "user@example.com"
        });
});

afterAll(() => {
    nock.cleanAll();
});

describe("Server API Endpoints", () => {
    describe("GET /health", () => {
        it("should return 200 OK with health status", async () => {
            const res = await request(app).get("/health");
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("status", "OK");
        });
    });

    describe("GET /api/users", () => {
        it("should return user data from external API", async () => {
            const res = await request(app).get("/api/users");
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                data: [{
                        id: 1,
                        first_name: "John",
                        last_name: "Doe"
                    },
                    {
                        id: 2,
                        first_name: "Jane",
                        last_name: "Smith"
                    }
                ]
            });
        });

        it("should handle API errors", async () => {
            nock("https://reqres.in")
                .get("/api/users?page=2")
                .reply(500);

            const res = await request(app).get("/api/users");
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({
                message: "Error fetching user data"
            });
        });
    });

    describe("POST /api/login", () => {
        it("should return token for valid credentials", async () => {
            const res = await request(app)
                .post("/api/login")
                .send({
                    username: "emilys",
                    password: "emilyspass"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("accessToken", "mockToken123");
        });

        it("should return 401 for invalid credentials", async () => {
            nock("https://dummyjson.com")
                .post("/auth/login")
                .reply(401);

            const res = await request(app)
                .post("/api/login")
                .send({
                    username: "wrong",
                    password: "credentials"
                });

            expect(res.statusCode).toBe(401);
        });
    });

    describe("GET /api/dummy-user", () => {
        it("should return user data with valid token", async () => {
            const res = await request(app)
                .get("/api/dummy-user")
                .set("Authorization", "Bearer mockToken123");

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                id: 1,
                username: "mockUser",
                email: "user@example.com"
            });
        });

        it("should return 401 without token", async () => {
            const res = await request(app).get("/api/dummy-user");
            expect(res.statusCode).toBe(401);
        });
    });
});

// Rate Limiting
describe("Rate Limiting", () => {
    it("should block requests exceeding the rate limit", async () => {
        for (let i = 0; i < 101; i++) {
            await request(app).get("/api/users");
        }
        const res = await request(app).get("/api/users");
        expect(res.statusCode).toBe(429);
        expect(res.body.error).toBe("Too many requests, please try again later.");
    });
});

//   Environment Validation
describe("Environment Validation Middleware", () => {
    it("should throw an error if environment validation fails", () => {
        process.env.VITE_API_USERS = undefined;
        expect(() => validateEnvironment()).toThrow("Environment validation failed");
    });
});

