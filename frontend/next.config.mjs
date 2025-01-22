import fs from "fs";
import path from "path";
import yaml from "js-yaml";

// Synchronously load and parse the YAML file
const filePath = path.join(process.cwd(), '../config.yaml');
const fileContents = fs.readFileSync(filePath, "utf8");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CONFIG_DATA: fileContents, // Pass the config object as a JSON string
  },
};

export default nextConfig;

