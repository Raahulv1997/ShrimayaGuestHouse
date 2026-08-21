import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an image/video title'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Please add a media URL'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Rooms', 'Facilities', 'Exterior', 'Interior'],
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
