export interface MediaItem {
  formatId?: number | string;
  label?: string;
  type?: string;
  ext?: string;
  quality?: string;
  width?: number;
  height?: number;
  url?: string;
}

export function selectQualityMedia(medias: MediaItem[], qualityOpt: string): MediaItem | null {
  if (!medias || medias.length === 0) {
    return null;
  }

  const normalized = qualityOpt.trim().toLowerCase();

  if (normalized === "best") {
    // Pick media with maximum height
    return medias.reduce(
      (prev, curr) => ((curr.height || 0) > (prev.height || 0) ? curr : prev),
      medias[0]
    );
  }

  if (normalized === "worst") {
    // Pick media with minimum height
    return medias.reduce(
      (prev, curr) => ((curr.height || 0) < (prev.height || 0) ? curr : prev),
      medias[0]
    );
  }

  // Parse target numeric resolution (e.g., "720", "1080p")
  const numericMatch = normalized.match(/(\d+)/);
  if (numericMatch) {
    const targetHeight = parseInt(numericMatch[1], 10);

    // 1. Try exact height match
    const exact = medias.find((m) => m.height === targetHeight);
    if (exact) {
      return exact;
    }

    // 2. Find media with the closest height to targetHeight
    let closest = medias[0];
    let minDiff = Math.abs((medias[0].height || 0) - targetHeight);

    for (let i = 1; i < medias.length; i++) {
      const diff = Math.abs((medias[i].height || 0) - targetHeight);
      if (diff < minDiff) {
        minDiff = diff;
        closest = medias[i];
      }
    }
    return closest;
  }

  // Fallback to best if string format unrecognized
  return medias.reduce(
    (prev, curr) => ((curr.height || 0) > (prev.height || 0) ? curr : prev),
    medias[0]
  );
}
