import Joi from "joi";

const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  VITE_API_USERS: Joi.string().uri().required(),
  VITE_API_BEARER_TOKEN: Joi.string().uri().required(),
  VITE_API_LOGIN: Joi.string().uri().required(),
  VITE_API_USERNAME: Joi.string().required(),
  VITE_API_PASSWORD: Joi.string().required(),
  VITE_EXPRESS_API_LOGIN: Joi.string().uri().required(),
  VITE_EXPRESS_API_DUMMY_USER: Joi.string().uri().required(),
}).unknown(true);

const validateEnvironment = () => {
  const { error, value } = envSchema.validate(process.env);

  if (error) {
    console.error("Environment validation error:", error.details);
    throw new Error(`Environment validation failed: ${error.message}`);
  }

  console.log("Environment validation successful.");
  return value; // Return the validated environment variables
};

export default validateEnvironment;
