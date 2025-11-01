# MCP Servers Quick Reference

## Essential MCP Servers for Photography Website Automation

### 1. Webflow MCP Server (CRITICAL - Official)
```bash
# Installation
npm install -g @webflow/mcp-server

# Configuration (OAuth)
# Add to Claude Desktop config or mcp-remote
```

**Repository:** https://github.com/webflow/mcp-server
**Status:** Official, Production-Ready
**Auth:** OAuth 2.0 via remote setup
**Requirements:** Node.js 22.3.0+

**Capabilities:**
- Create/update CMS collection items
- Designer API access (style learning!)
- Inline script management
- Full CRUD on content
- Real-time site updates

**Why Critical:** Only way to automate Webflow publishing + theme learning

---

### 2. Whisper Transcription MCP Server
```bash
# Installation
npx @modelcontextprotocol/create-server whisper-transcription

# Or use:
# arcaputo3/mcp-server-whisper
```

**Repository:** https://github.com/arcaputo3/mcp-server-whisper
**Status:** Community, Active Development
**Auth:** OpenAI API Key required
**Cost:** ~$0.006 per minute of audio

**Capabilities:**
- Transcribe voice memos
- Multiple languages
- Timestamps
- Speaker detection (advanced models)

**Why Needed:** Converts your voice notes about shoots into text for AI processing

---

### 3. Cloudinary MCP Server (Official)
```bash
# Installation
npm install @cloudinary/mcp-server
```

**Repository:** https://github.com/cloudinary/mcp-servers
**Status:** Official, Production-Ready
**Auth:** API Key (free tier available)
**Cost:** Free tier = 25 credits/month (~500 transformations)

**Capabilities:**
- Upload & optimize images
- Generate responsive variants (WebP, AVIF)
- Auto-quality adjustments
- Face detection cropping
- Apply transformations (filters, effects)
- Organize in folders
- Generate URLs for embedding

**Why Needed:** Professional image optimization without manual work

---

### 4. Google Drive MCP Server (Community)
```bash
# Multiple implementations available
# Recommended: Use Composio's implementation
npm install @composio/mcp-googledrive
```

**Repository:** https://mcp.composio.dev/googledrive
**Status:** Community, Multiple Options
**Auth:** Google OAuth
**Cost:** Free with personal Google account

**Capabilities:**
- Access Drive files via natural language
- Download from shared links
- Search and retrieve documents
- Automated file organization
- Content extraction for AI analysis

**Why Needed:** Accepts WeTransfer/Google Drive links for photo uploads

---

### 5. DataForSEO MCP Server (Optional - Advanced)
```bash
# Installation details at:
# https://www.pulsemcp.com/servers/dataforseo
```

**Repository:** Official DataForSEO integration
**Status:** Official, Production-Ready
**Auth:** DataForSEO API key
**Cost:** Pay-as-you-go (starts $0.001 per request)

**Capabilities:**
- Real-time keyword research
- Competitor analysis
- SERP data
- On-page SEO analysis
- Backlink research
- Content optimization suggestions

**Why Optional:** Basic SEO possible without it; adds advanced competitive intelligence

---

## MCP Servers for Future Expansion

### Ghost CMS MCP Server
**Repository:** https://github.com/MFYDev/ghost-mcp
**Status:** Community, Typescript + Python versions
**Use Case:** If you choose Ghost over Webflow

### n8n Integration (Not MCP, but complements)
**Platform:** https://n8n.io
**Purpose:** Workflow automation for social media posting
**Free Tier:** Self-host on Railway/Render
**Templates:** 4,339 AI workflow templates available

---

## Configuration for Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "webflow": {
      "command": "npx",
      "args": ["-y", "@webflow/mcp-server"],
      "env": {
        "WEBFLOW_API_TOKEN": "your_token_here"
      }
    },
    "whisper": {
      "command": "npx",
      "args": ["-y", "mcp-server-whisper"],
      "env": {
        "OPENAI_API_KEY": "your_openai_key"
      }
    },
    "cloudinary": {
      "command": "npx",
      "args": ["-y", "@cloudinary/mcp-server"],
      "env": {
        "CLOUDINARY_CLOUD_NAME": "your_cloud_name",
        "CLOUDINARY_API_KEY": "your_api_key",
        "CLOUDINARY_API_SECRET": "your_api_secret"
      }
    },
    "googledrive": {
      "command": "npx",
      "args": ["-y", "@composio/mcp-googledrive"],
      "env": {
        "GOOGLE_CLIENT_ID": "your_client_id",
        "GOOGLE_CLIENT_SECRET": "your_client_secret"
      }
    }
  }
}
```

---

## API Keys Needed

### Immediate (MVP):
1. **Webflow API Token**
   - Get from: https://designers.webflow.com/workspace/integrations
   - Permissions: Full CMS access

2. **OpenAI API Key**
   - Get from: https://platform.openai.com/api-keys
   - Used for: Whisper transcription + Claude fallback

3. **Cloudinary Account**
   - Sign up: https://cloudinary.com/users/register/free
   - Free tier: 25 credits/month

### Optional (Later):
4. **Google Drive OAuth**
   - Set up: https://console.cloud.google.com/
   - Enable: Google Drive API

5. **DataForSEO API**
   - Sign up: https://dataforseo.com/
   - Start with $1 credit for testing

---

## Cost Summary

| MCP Server | Monthly Cost | Notes |
|------------|--------------|-------|
| Webflow | $0 | Included with Webflow plan |
| Whisper | ~$1-2 | Based on 20-30 min audio/month |
| Cloudinary | $0 | Free tier sufficient for MVP |
| Google Drive | $0 | Personal account |
| DataForSEO | $0-5 | Optional, pay-per-use |
| **TOTAL** | ~$1-7 | Just for MCP servers |

**Add platform costs:**
- Webflow Basic: $29/month
- Vercel Hosting: $0 (free tier)
- **Grand Total: ~$30-36/month**

---

## Testing MCP Servers

### Quick Test Commands (in Claude Desktop)

Once configured, test each server:

```
# Test Webflow
"List my Webflow sites"
"Show me the collections in [site-name]"

# Test Whisper
"Transcribe this audio file: /path/to/memo.m4a"

# Test Cloudinary
"Upload this image and optimize it: /path/to/photo.jpg"

# Test Google Drive
"Show me recent files in my Drive"
```

---

## Troubleshooting

### Webflow MCP Not Connecting
- Verify Node.js 22.3.0+ installed: `node --version`
- Check OAuth token is valid
- Ensure site has API access enabled

### Whisper Transcription Failing
- Verify OpenAI API key is correct
- Check audio file format (supports: mp3, m4a, wav, webm)
- File size limit: 25MB per file

### Cloudinary Upload Issues
- Verify all 3 env vars set (cloud name, API key, secret)
- Check free tier limits not exceeded
- Ensure image format supported

### General MCP Issues
- Restart Claude Desktop after config changes
- Check JSON syntax in config file
- View logs: `~/Library/Logs/Claude/mcp*.log`

---

## Next Steps

1. **Set up Webflow account** (if migrating)
2. **Get API keys** for all services
3. **Configure MCP servers** in Claude Desktop
4. **Test each server** individually
5. **Build upload dashboard** (Next.js + Vercel)
6. **Connect the pipeline** (upload → transcribe → generate → publish)

---

## Support Resources

- [MCP Official Docs](https://modelcontextprotocol.io/)
- [Webflow MCP Docs](https://developers.webflow.com/data/docs/ai-tools)
- [MCP Server Directory](https://mcpservers.org/)
- [Claude Desktop MCP Guide](https://docs.anthropic.com/claude/docs/claude-desktop-mcp)

---

**Questions?** Drop them in the main plan document or ask during development!
