// src/utils/utils.service.ts
import {
  Injectable,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { lookup as mimeLookup } from 'mime-types';
import * as dotenv from 'dotenv';

@Injectable()
export class UtilsService {
  private outputDir = path.join(__dirname, '../../svg-outputs');
  private getTempPngPath(originalPath: string): string {
    const fileName = path.basename(originalPath, path.extname(originalPath));
    return path.join(__dirname, `${fileName}-temp.png`);
  }

  constructor() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir);
    }
  }
  
  // Parses basic SELECT SQL to JSON
  parseSqlToJson(sql: string) {
    const selectRegex = /SELECT (.+) FROM (\w+)(?: WHERE (.+))?/i;
    const match = sql.match(selectRegex);

    if (!match) throw new Error('Invalid SELECT SQL syntax');

    const [, columns, table, where] = match;
    return {
      type: 'select',
      table,
      columns: columns.split(',').map((col) => col.trim()),
      where: where || null,
    };
  }

  // Parses basic INSERT SQL to JSON
  parseInsertSqlToJson(sql: string) {
    const insertRegex = /INSERT INTO (\w+)\s*\((.+)\)\s*VALUES\s*\((.+)\)/i;
    const match = sql.match(insertRegex);

    if (!match) throw new Error('Invalid INSERT SQL syntax');

    const [, table, columns, values] = match;

    const columnList = columns.split(',').map((c) => c.trim());
    const valueList = values
      .split(',')
      .map((v) => v.trim().replace(/^'|'$/g, ''));

    const data: Record<string, string> = {};
    columnList.forEach((col, idx) => {
      data[col] = valueList[idx];
    });

    return {
      type: 'insert',
      table,
      data,
    };
  }

  // Converts JSON to basic INSERT SQL
  jsonToInsertSql(input: {
    table: string;
    data: Record<string, string | number>;
  }): string {
    const { table, data } = input;
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data)
      .map((v) => (typeof v === 'string' ? `'${v}'` : v))
      .join(', ');

    return `INSERT INTO ${table} (${columns}) VALUES (${values});`;
  }

  // --- General Utilities ---

  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  toKebabCase(text: string): string {
    return text
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  reverseString(text: string): string {
    return text.split('').reverse().join('');
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }

  language(filename: string, mimeType?: string): string | undefined {
    if (!filename) return;

    const ext = filename.split('.').pop()?.toLowerCase();

    const extMap: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      json: 'json',
      html: 'html',
      css: 'css',
      md: 'markdown',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      cs: 'csharp',
      rs: 'rust',
      sh: 'shell',
      yml: 'yaml',
      yaml: 'yaml',
      xml: 'xml',
      txt: 'plaintext',
      go: 'go',
      php: 'php',
    };

    if (ext && extMap[ext]) {
      return extMap[ext];
    }

    const detectedMimeType = mimeType || mimeLookup(filename) || undefined;

    const mimeMap: Record<string, string> = {
      'application/json': 'json',
      'text/html': 'html',
      'text/css': 'css',
      'application/javascript': 'javascript',
      'application/typescript': 'typescript',
      'text/markdown': 'markdown',
      'application/xml': 'xml',
      'text/x-python': 'python',
      'text/plain': 'plaintext',
      'video/mp2t': 'typescript', // override for .ts files
    };

    return detectedMimeType ? mimeMap[detectedMimeType] : undefined;
  }

  // --- Time Utilities ---

  timeAgo(ms: number): string {
    const formatter = new Intl.RelativeTimeFormat('en');
    const sec = Math.round(ms / 1000);
    const min = Math.round(sec / 60);
    const hr = Math.round(min / 60);
    const day = Math.round(hr / 24);
    const month = Math.round(day / 30);
    const year = Math.round(month / 12);

    if (sec < 10) {
      return 'just now';
    } else if (sec < 45) {
      return formatter.format(-sec, 'second');
    } else if (sec < 90 || min < 45) {
      return formatter.format(-min, 'minute');
    } else if (min < 90 || hr < 24) {
      return formatter.format(-hr, 'hour');
    } else if (hr < 36 || day < 30) {
      return formatter.format(-day, 'day');
    } else if (month < 18) {
      return formatter.format(-month, 'month');
    } else {
      return formatter.format(-year, 'year');
    }
  }

  toUnixSeconds(date: Date | string): number {
    return Math.floor(new Date(date).getTime() / 1000);
  }

  parseDurationToMs(duration: string): number {
    const match = duration.match(/^(\d+)([dhms])$/);
    if (!match) throw new Error('Invalid duration format');

    const [_, amountStr, unit] = match;
    const amount = parseInt(amountStr, 10);

    switch (unit) {
      case 'd':
        return amount * 24 * 60 * 60 * 1000;
      case 'h':
        return amount * 60 * 60 * 1000;
      case 'm':
        return amount * 60 * 1000;
      case 's':
        return amount * 1000;
      default:
        throw new Error('Unknown time unit');
    }
  }

  formatUnixTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  extractMarkdownTitle(markdown: string): string | null {
    const match = markdown.match(/^#\s+(.*)/m);
    return match ? match[1].trim() : null;
  }

  uniqueArray<T>(arr: T[]): T[] {
    return [...new Set(arr)];
  }

  parseEnvToJsonString(content: string): Record<string, string> {
    const lines = content.split('\n');
    const result: Record<string, string> = {};

    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith('#')) continue;

      const [key, ...rest] = line.split('=');
      const value = rest
        .join('=')
        .trim()
        .replace(/^"(.*)"$/, '$1');
      result[key.trim()] = value;
    }

    return result;
  }
  async parseEnvFile(
    file?: Express.Multer.File,
    filepath?: string,
  ): Promise<{ filepath: string; data: Record<string, string> }> {
    if (file && filepath) {
      throw new HttpException(
        'Provide either an uploaded file or a filepath, not both.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!file && !filepath) {
      throw new HttpException(
        'Either an uploaded file or a filepath must be provided.',
        HttpStatus.BAD_REQUEST,
      );
    }

    let content: string;
    let sourcePath: string;

    if (file) {
      content = file.buffer.toString('utf-8');
      sourcePath = file.originalname;
    } else {
      // Assert filepath is defined at this point
      const safePath = filepath as string;
      try {
        const resolvedPath = path.resolve(safePath);
        content = await fs.promises.readFile(resolvedPath, 'utf-8');
        sourcePath = resolvedPath;
      } catch (err) {
        throw new HttpException(
          `Failed to read file at path: ${safePath}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    try {
      const parsed = dotenv.parse(content);
      return { filepath: sourcePath, data: parsed };
    } catch (err) {
      throw new HttpException(
        'Failed to parse .env file',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
