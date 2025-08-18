export interface Model3D {
  id: string;
  name: string;
  description: string;
  txtFile: string;
  textureFile?: string;
  previewImage?: string;
  category: 'character' | 'object' | 'environment' | 'sample';
  author?: string;
}

export const AVAILABLE_MODELS: Model3D[] = [
  {
    id: 'ricky-dog',
    name: 'Ricky the Dog',
    description: 'Cute pixel art dog character with detailed texture',
    txtFile: '/models/ricky/ricky_the_dog.txt',
    textureFile: '/models/ricky/ricky_the_dog.png',
    category: 'character',
    author: 'PicoCad Community'
  },
  {
    id: 'sample-cube',
    name: 'Sample Cube',
    description: 'Basic textured cube for testing',
    txtFile: '/models/sample.txt',
    category: 'sample',
    author: 'Demo'
  }
];

export function getModelById(id: string): Model3D | undefined {
  return AVAILABLE_MODELS.find(model => model.id === id);
}

export function getModelsByCategory(category: string): Model3D[] {
  return AVAILABLE_MODELS.filter(model => model.category === category);
}