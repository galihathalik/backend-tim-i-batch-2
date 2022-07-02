import { readFileSync } from "fs";
import * as yaml from 'js-yaml';
import { join } from "path";
const YAML_CONFIG_FILENAME = 'config.yml';

export interface ServerConfig {
  port: string;
}
export interface DbConfigMysql {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface DbConfigRedis {
  host: string;
  port: number;
  password: string;
  db: number;
}

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
};