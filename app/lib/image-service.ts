interface ImageUploadResult {
  success: boolean;
  url: string;
  error?: string;
}

export class ImageService {
  private imgbbApiKey: string;

  constructor(apiKey: string) {
    this.imgbbApiKey = apiKey;
  }

  async uploadImage(imageUrl: string): Promise<ImageUploadResult> {
    try {
      // Fetch the image
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      
      // Create form data
      const formData = new FormData();
      formData.append('image', Buffer.from(imageBuffer).toString('base64'));
      
      // Upload to ImgBB
      const uploadResponse = await fetch(`https://api.imgbb.com/1/upload?key=${this.imgbbApiKey}`, {
        method: 'POST',
        body: formData
      });
      
      const result = await uploadResponse.json();
      
      if (result.success) {
        return {
          success: true,
          url: result.data.url
        };
      }

      return {
        success: false,
        url: imageUrl,
        error: 'Failed to upload to ImgBB'
      };

    } catch (error) {
      console.error('Image upload failed:', error);
      return {
        success: false,
        url: imageUrl,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
} 