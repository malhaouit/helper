import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import mime from 'mime-types';
import { ObjectId } from 'mongodb';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class FilesController {
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      name, type, parentId = 0, isPublic = false, data,
    } = req.body;

    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    if (parentId !== 0) {
      const parent = await dbClient.db.collection('files').findOne({ _id: new ObjectId(parentId) });
      if (!parent) return res.status(400).json({ error: 'Parent not found' });
      if (parent.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
    }

    const fileDoc = {
      userId: new ObjectId(userId),
      name,
      type,
      isPublic,
      parentId: parentId === 0 ? '0' : new ObjectId(parentId),
      localPath: null,
    };

    if (type === 'folder') {
      const result = await dbClient.db.collection('files').insertOne(fileDoc);
      return res.status(201).json({
        id: result.insertedId.toString(),
        userId,
        name,
        type,
        isPublic,
        parentId,
      });
    }

    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    const fileId = uuidv4();
    const localPath = path.join(folderPath, fileId);

    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(localPath, Buffer.from(data, 'base64'));

    fileDoc.localPath = localPath;
    const result = await dbClient.db.collection('files').insertOne(fileDoc);

    return res.status(201).json({
      id: result.insertedId.toString(),
      userId,
      name,
      type,
      isPublic,
      parentId,
    });
  }

  static async getShow(req, res) {
    const token = req.headers['x-token'];
    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const file = await dbClient.db.collection('files').findOne({
        _id: new ObjectId(req.params.id),
        userId: new ObjectId(userId),
      });

      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      // Transform the file document to match the required output
      const fileData = {
        id: file._id.toString(), // Convert _id to id
        userId: file.userId.toString(),
        name: file.name,
        type: file.type,
        isPublic: file.isPublic,
        parentId: file.parentId,
      };

      return res.status(200).json(fileData);
    } catch (error) {
      return res.status(404).json({ error: 'Not found' });
    }
  }

  static async getIndex(req, res) {
    const token = req.headers['x-token'];
    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { parentId = '0', page = 0 } = req.query;
    const pageNum = parseInt(page, 10) || 0;

    const filter = {
      userId: new ObjectId(userId),
      parentId: parentId === '0' ? '0' : new ObjectId(parentId),
    };

    try {
      const files = await dbClient.db.collection('files')
        .find(filter)
        .skip(pageNum * 20)
        .limit(20)
        .toArray();

      // Transform files array to match the required output
      const transformedFiles = files.map((file) => ({
        id: file._id.toString(), // Convert _id to id
        userId: file.userId.toString(),
        name: file.name,
        type: file.type,
        isPublic: file.isPublic,
        parentId: file.parentId,
      }));

      return res.status(200).json(transformedFiles);
    } catch (error) {
      return res.status(500).json({ error: 'Error retrieving files' });
    }
  }

  static async putPublish(req, res) {
    const token = req.headers['x-token'];
    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const file = await dbClient.db.collection('files').findOne({
        _id: new ObjectId(req.params.id),
        userId: new ObjectId(userId),
      });

      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      // Update isPublic to true
      await dbClient.db.collection('files').updateOne(
        { _id: new ObjectId(req.params.id), userId: new ObjectId(userId) },
        { $set: { isPublic: true } },
      );

      // Return updated file document
      const updatedFile = await dbClient.db.collection('files').findOne({
        _id: new ObjectId(req.params.id),
        userId: new ObjectId(userId),
      });

      const response = {
        id: updatedFile._id.toString(),
        userId: updatedFile.userId.toString(),
        name: updatedFile.name,
        type: updatedFile.type,
        isPublic: updatedFile.isPublic,
        parentId: updatedFile.parentId,
      };

      return res.status(200).json(response);
    } catch (error) {
      return res.status(404).json({ error: 'Not found' });
    }
  }

  static async putUnpublish(req, res) {
    const token = req.headers['x-token'];
    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const file = await dbClient.db.collection('files').findOne({
        _id: new ObjectId(req.params.id),
        userId: new ObjectId(userId),
      });

      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      await dbClient.db.collection('files').updateOne(
        { _id: new ObjectId(req.params.id), userId: new ObjectId(userId) },
        { $set: { isPublic: false } },
      );

      const updatedFile = await dbClient.db.collection('files').findOne({
        _id: new ObjectId(req.params.id),
        userId: new ObjectId(userId),
      });

      const response = {
        id: updatedFile._id.toString(),
        userId: updatedFile.userId.toString(),
        name: updatedFile.name,
        type: updatedFile.type,
        isPublic: updatedFile.isPublic,
        parentId: updatedFile.parentId,
      };

      return res.status(200).json(response);
    } catch (error) {
      return res.status(404).json({ error: 'Not found' });
    }
  }

  static async getFile(req, res) {
    const { id } = req.params;
    const token = req.headers['x-token'] || null;

    let file;
    try {
      file = await dbClient.db.collection('files').findOne({ _id: new ObjectId(id) });
      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }
    } catch (err) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (file.type === 'folder') {
      return res.status(400).json({ error: "A folder doesn't have content" });
    }

    let userId;
    if (token) {
      const tokenKey = `auth_${token}`;
      userId = await redisClient.get(tokenKey);
    }

    if (!file.isPublic) {
      if (!userId || (userId && file.userId.toString() !== userId)) {
        return res.status(404).json({ error: 'Not found' });
      }
    }

    if (!file.localPath || !(await fs.stat(file.localPath).catch(() => false))) {
      return res.status(404).json({ error: 'Not found' });
    }

    const mimeType = mime.lookup(file.name);
    res.setHeader('Content-Type', mimeType || 'application/octet-stream');

    const fileContent = await fs.readFile(file.localPath);
    return res.status(200).send(fileContent);
  }
}

export default FilesController;
