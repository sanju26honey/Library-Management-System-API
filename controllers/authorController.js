const Author = require("../models/Author");
const mongoose = require("mongoose");

exports.getAuthors = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, nationality } = req.query;
    const filter = {};
    if (name) filter.name = new RegExp(name, 'i');
    if (nationality) filter.nationality = new RegExp(nationality, 'i');

    const authors = await Author.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Author.countDocuments(filter);

    res.json({ authors, page, limit, total });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch authors', error });
  }
}

exports.getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid author ID' });
    }

    const author = await Author.findById(id);
    if (!author) return res.status(404).json({ message: 'Author not found' });

    res.json(author);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching author', error });
  }
}

exports.createAuthor = async (req, res) => {
  try {
    const { name, bio, dob, nationality } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const author = new Author({ name, bio, dob, nationality });
    await author.save();

    res.status(201).json({ message: 'Author created successfully', author });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create author', error });
  }
}

exports.updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Invalid author ID' });

    const updatedAuthor = await Author.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedAuthor) return res.status(404).json({ message: 'Author not found' });

    res.json({ message: 'Author updated successfully', author: updatedAuthor });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update author', error });
  }
}

exports.deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'Invalid author ID' });

    const deletedAuthor = await Author.findByIdAndDelete(id);
    if (!deletedAuthor) return res.status(404).json({ message: 'Author not found' });

    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete author', error });
  }
}