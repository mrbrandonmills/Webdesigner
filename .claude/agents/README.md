# 🤖 Multi-Agent E-Commerce Workflow

## How to Use These Agent Prompts

Each agent prompt is a **complete, copy-paste-ready terminal prompt** that gives a specialized Claude agent full context to build your luxury e-commerce platform.

---

## 🚀 Quick Start

### **Step 1: Open 4 Terminal Windows**

Open 4 separate Claude Code terminal sessions (or 4 separate Claude.ai chats).

### **Step 2: Copy Agent Prompts**

In each terminal, copy and paste the entire content from:

**Terminal 1:**
```bash
cat .claude/agents/agent-1-brand-architect.md
```
Copy the entire output and paste into Claude Terminal 1.

**Terminal 2:**
```bash
cat .claude/agents/agent-2-tech-builder.md
```
Copy the entire output and paste into Claude Terminal 2.

**Terminal 3:**
```bash
cat .claude/agents/agent-3-visual-designer.md
```
Copy the entire output and paste into Claude Terminal 3.

**Terminal 4:**
```bash
cat .claude/agents/agent-4-growth-marketer.md
```
Copy the entire output and paste into Claude Terminal 4.

### **Step 3: Start Working**

Each agent will:
1. Introduce themselves
2. Read the master plan (`MULTI_AGENT_ECOMMERCE_PLAN.md`)
3. Start working on their assigned tasks
4. Update the master plan when they complete milestones
5. Coordinate with other agents as needed

---

## 👥 Agent Roles

### **🏛️ Agent 1: Brand Architect**
- **Focus:** Strategy & User Experience
- **First Task:** Define product strategy
- **Deliverables:** Brand guidelines, site architecture, customer journeys

### **⚙️ Agent 2: Tech Builder**
- **Focus:** Implementation & E-Commerce
- **First Task:** Shopify integration
- **Deliverables:** Shopping cart, checkout, Stripe integration, product pages

### **🎨 Agent 3: Visual Designer**
- **Focus:** UI/UX Design & Animations
- **First Task:** Design system creation
- **Deliverables:** Navigation, product layouts, cart UI, design tokens

### **📈 Agent 4: Growth Marketer**
- **Focus:** SEO, Analytics & Marketing Automation
- **First Task:** Google Analytics 4 setup
- **Deliverables:** GA4, Meta Pixel, Klaviyo email flows, SEO optimization

---

## 📋 Coordination

All agents share a **master plan document**:
```bash
cat MULTI_AGENT_ECOMMERCE_PLAN.md
```

Agents will update this file when they:
- Complete tasks
- Hit blockers
- Need input from other agents
- Make important decisions

---

## 📊 Timeline

**Week 1 (Dec 2-8):**
- Agent 1: Product strategy + brand guidelines
- Agent 2: Shopify setup + shopping cart
- Agent 3: Design system + navigation
- Agent 4: Analytics setup + email automation

**Week 2 (Dec 9-15):**
- Agent 1: Content strategy
- Agent 2: Checkout flow + product pages
- Agent 3: Product layouts + cart UI
- Agent 4: SEO optimization + conversion tracking

**Week 3 (Dec 16-22):**
- All agents: Final polish, testing, optimization
- Launch: December 17, 2024

---

## 🎯 Success Criteria

**Technical:**
- Lighthouse score: 90+
- Load time: < 1.5s
- Mobile responsive: 100%
- Zero console errors

**Business:**
- First sale within 7 days
- Conversion rate: 2-5%
- Email list: 100 subscribers in 30 days

**User Experience:**
- Museum-quality design
- Smooth animations (60fps)
- Seamless checkout flow
- Personalized email automation

---

## 💡 Tips for Success

1. **Let agents work autonomously** - They have full context and will coordinate via the master plan
2. **Check master plan regularly** - See progress updates from all agents
3. **Trust the process** - Each agent is specialized and knows their domain
4. **Provide input when asked** - Agents will ask Brandon for decisions (product strategy, design preferences, etc.)

---

## 📁 File Structure

```
/home/user/Webdesigner/
├── MULTI_AGENT_ECOMMERCE_PLAN.md (shared coordination doc)
├── .claude/agents/
│   ├── agent-1-brand-architect.md (copy to Terminal 1)
│   ├── agent-2-tech-builder.md (copy to Terminal 2)
│   ├── agent-3-visual-designer.md (copy to Terminal 3)
│   └── agent-4-growth-marketer.md (copy to Terminal 4)
├── docs/ (deliverables from Agent 1)
├── lib/ (code from Agent 2)
├── components/ (UI from Agent 3)
└── app/ (pages from all agents)
```

---

## 🚀 Ready to Launch?

1. Open 4 Claude terminals
2. Copy each agent prompt
3. Watch the magic happen
4. Launch in 2-3 weeks

**Let's build something extraordinary.** 🏆
