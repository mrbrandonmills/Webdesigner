# Hero Video Placeholder

## Instructions

Add your cinematic hero video to this directory as `hero-loop.mp4`

## Recommended Specifications:
- **Duration**: 10-20 second seamless loop
- **Resolution**: 1920x1080 (Full HD) minimum
- **Format**: H.264 MP4
- **File Size**: < 5MB for optimal web performance
- **Content**: Brandon in photoshoot, editorial setting, or artistic environment
- **Mood**: Cinematic, luxury, museum-quality

## Optimization Tips:
1. Use HandBrake or similar to compress video
2. Optimize for web with fast start
3. Remove audio track to reduce file size
4. Create seamless loop (first and last frames should match)
5. Consider creating additional formats (WebM) for browser compatibility

## Example Command (FFmpeg):
```bash
ffmpeg -i input.mp4 -vcodec h264 -acodec none -b:v 2M -maxrate 2M -bufsize 1M -pix_fmt yuv420p -movflags +faststart hero-loop.mp4
```

For now, a solid color fallback will display until you add your video.
