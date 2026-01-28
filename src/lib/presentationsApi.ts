// Client-side API for accessing presentations

export interface Presentation {
  id: string;
  title: string;
  path: string;
}

let presentationsCache: Presentation[] | null = null;

export async function getAllPresentations(): Promise<Presentation[]> {
  if (!presentationsCache) {
    const response = await fetch('/presentations-index.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch presentations index: ${response.statusText}`);
    }
    presentationsCache = await response.json();
  }
  return presentationsCache || [];
}

// For testing purposes
export function resetCache() {
  presentationsCache = null;
}
