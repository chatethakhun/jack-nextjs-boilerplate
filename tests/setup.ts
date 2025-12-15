import { config } from "dotenv"
import "@testing-library/jest-dom"

// This line loads the environment variables from your .env.test file
config({ path: ".env.test" })

// The rest of your setup file...