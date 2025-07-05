interface ColorPalette {
  colors: string[];
  score?: number;
}

interface HuemintOptions {
  mode?: 'transformer' | 'diffusion';
  numResults?: number;
  temperature?: number;
}

interface ColormindOptions {
  model?: string;
  input?: (string | null)[];
}

class ColorServicesClient {
  private static instance: ColorServicesClient;
  private colormindEndpoint: string;

  private constructor() {
    this.colormindEndpoint = import.meta.env.VITE_COLORMIND_API_ENDPOINT || 'http://colormind.io/api/';
  }

  public static getInstance(): ColorServicesClient {
    if (!ColorServicesClient.instance) {
      ColorServicesClient.instance = new ColorServicesClient();
    }
    return ColorServicesClient.instance;
  }

  public async generateHuemintPalette(
    options: HuemintOptions = {}
  ): Promise<ColorPalette[] | null> {
    try {
      const response = await fetch('https://api.huemint.com/color', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: options.mode || 'transformer',
          num_results: options.numResults || 5,
          temperature: options.temperature || 0.5,
        }),
      });

      if (!response.ok) {
        throw new Error(`Huemint API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results.map((result: any) => ({
        colors: result.palette,
        score: result.score,
      }));
    } catch (error) {
      console.error('Error generating Huemint palette:', error);
      return null;
    }
  }

  public async generateColormindPalette(
    options: ColormindOptions = {}
  ): Promise<ColorPalette | null> {
    try {
      const response = await fetch(this.colormindEndpoint, {
        method: 'POST',
        body: JSON.stringify({
          model: options.model || 'default',
          input: options.input || ['N', 'N', 'N', 'N', 'N'],
        }),
      });

      if (!response.ok) {
        throw new Error(`Colormind API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        colors: data.result.map((rgb: number[]) => 
          `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`
        ),
      };
    } catch (error) {
      console.error('Error generating Colormind palette:', error);
      return null;
    }
  }
}

export const colorServicesClient = ColorServicesClient.getInstance(); 