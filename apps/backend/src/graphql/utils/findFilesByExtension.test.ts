import { describe, expect, test, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import findFilesByExtension from './findFilesByExtension';

vi.mock('fs', () => ({
  readdirSync: vi.fn(),
}));

vi.mock('path', async () => ({
  join: vi.fn(),
}));

describe('findFilesByExtension', () => {
  const testDir = 'test-dir';

  test('should return an empty array for an empty directory', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue([]);
    expect(findFilesByExtension(testDir, '.txt')).toEqual([]);
    expect(fs.readdirSync).toHaveBeenCalledWith(testDir, { withFileTypes: true });
  });

  test('should return an empty array if no files match the extension', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['file.js'] as any);
    vi.spyOn(fs, 'readdirSync').mockReturnValueOnce([{ name: testDir, isDirectory: () => true } as any]);
    expect(findFilesByExtension(testDir, '.txt')).toEqual([]);
    expect(fs.readdirSync).toHaveBeenCalledWith(testDir, { withFileTypes: true });
  });

  test('should return an array of file paths for files matching the extension', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['file1.txt', 'file2.txt'] as any);
    vi.spyOn(fs, 'readdirSync').mockReturnValueOnce([{ name: testDir, isDirectory: () => true, path: '' } as any]);
    vi.spyOn(path, 'join').mockImplementation((...args) => args.join('/'));
    expect(findFilesByExtension(testDir, '.txt')).toEqual(['/test-dir/file1.txt', '/test-dir/file2.txt']);
    expect(fs.readdirSync).toHaveBeenCalledWith(testDir, { withFileTypes: true });
  });

  test('should handle mixed files and directories', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['file1.txt', 'file2.txt'] as any);
    vi.spyOn(fs, 'readdirSync').mockReturnValueOnce([
      { name: testDir, isDirectory: () => true, path: '' },
      { name: 'file1.txt', isDirectory: () => false },
      { name: 'file.js', isDirectory: () => false },
    ] as any);
    vi.spyOn(path, 'join').mockImplementation((...args) => args.join('/'));
    expect(findFilesByExtension(testDir, '.txt')).toEqual(['/test-dir/file1.txt', '/test-dir/file2.txt']);
    expect(fs.readdirSync).toHaveBeenCalledWith(testDir, { withFileTypes: true });
  });
});
