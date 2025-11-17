# 🎨 Custom Logo Setup Guide

## Quick Start

### Step 1: Prepare Your Logo Files

Create these logo versions:

1. **logo.png** (or .svg)
   - Use for: Light backgrounds (about page, headers)
   - Recommended size: 200x200px (will be scaled)
   - Format: PNG with transparent background or SVG

2. **logo-white.png** (or .svg)
   - Use for: Dark backgrounds (login/signup left panel, sidebar)
   - Recommended size: 200x200px (will be scaled)
   - Format: PNG with transparent background or SVG

3. **favicon.ico**
   - Use for: Browser tab icon
   - Size: 32x32px or 16x16px
   - Format: ICO file

### Step 2: Add Files to Project

```
public/
  ├── logo.png          # Your main logo (dark version)
  ├── logo-white.png    # White version for dark backgrounds
  └── favicon.ico       # Browser tab icon
```

### Step 3: Update Components

We've created a reusable `<Logo />` component in `src/components/logo.tsx`.

#### Usage Examples:

```tsx
import { Logo } from "@/components/logo";

// Default logo (for light backgrounds)
<Logo />

// White logo (for dark backgrounds)
<Logo variant="white" />

// Different sizes
<Logo size="sm" />  // Small (32px)
<Logo size="md" />  // Medium (44px) - default
<Logo size="lg" />  // Large (48px)

// Without text (image only)
<Logo showText={false} />

// Without link
<Logo href="" />
```

### Step 4: Update These Files

Replace the logo in these components:

1. **About Page Header** (`src/app/about/page.tsx`)
2. **Login Page** (`src/app/auth/login/page.tsx`)
3. **Signup Page** (`src/app/auth/signup/page.tsx`)
4. **Modern Sidebar** (`src/components/modern-sidebar.tsx`)

---

## Detailed Instructions

### 1. About Page Header

**File:** `src/app/about/page.tsx`

**Find:**
```tsx
<Link href="/about" className="flex items-center gap-3 group">
  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700...">
    <Activity className="h-6 w-6 text-white" strokeWidth={2.5} />
  </div>
  <div>
    <h1 className="text-xl font-bold text-gray-900 tracking-tight">MedRounds</h1>
    <p className="text-xs text-gray-500 font-medium">Medical Rounds</p>
  </div>
</Link>
```

**Replace with:**
```tsx
import { Logo } from "@/components/logo";

<Logo size="md" href="/about" />
```

### 2. Login Page (Left Panel)

**File:** `src/app/auth/login/page.tsx`

**Find:**
```tsx
<Link href="/about" className="flex items-center gap-3 group">
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20...">
    <Activity className="h-7 w-7 text-white" strokeWidth={2.5} />
  </div>
  <div>
    <h1 className="text-2xl font-bold text-white tracking-tight">MedRounds</h1>
    <p className="text-sm text-white/80 font-medium">Medical Rounds</p>
  </div>
</Link>
```

**Replace with:**
```tsx
import { Logo } from "@/components/logo";

<Logo variant="white" size="lg" href="/about" />
```

### 3. Signup Page (Left Panel)

**File:** `src/app/auth/signup/page.tsx`

Same as Login page - use:
```tsx
<Logo variant="white" size="lg" href="/about" />
```

### 4. Modern Sidebar

**File:** `src/components/modern-sidebar.tsx`

**Find the logo section and replace with:**
```tsx
import { Logo } from "@/components/logo";

<Logo size="md" href="/dashboard" />
```

### 5. Update Favicon

**File:** `src/app/layout.tsx`

Add to the `<head>` metadata:

```tsx
export const metadata = {
  title: "MedRounds",
  description: "Medical Rounds Management",
  icons: {
    icon: "/favicon.ico",
  },
};
```

---

## Logo Design Tips

### Recommended Specifications:

- **Format**: SVG (scalable) or PNG (high-res)
- **Size**: 200x200px minimum for PNG
- **Background**: Transparent
- **Colors**: 
  - Main logo: Use your brand colors
  - White logo: Solid white or light colored

### Design Guidelines:

1. **Keep it simple** - Should be recognizable at small sizes
2. **Square or horizontal** - Works best in the UI
3. **High contrast** - Ensure visibility on both light and dark backgrounds
4. **Professional** - Medical/healthcare appropriate

---

## Testing Your Logo

After adding your logo files:

1. Run `npm run dev`
2. Check these pages:
   - http://localhost:3000/about (header logo)
   - http://localhost:3000/auth/login (left panel white logo)
   - http://localhost:3000/auth/signup (left panel white logo)
   - http://localhost:3000/dashboard (sidebar logo)
3. Test different screen sizes (responsive)
4. Check browser tab for favicon

---

## Troubleshooting

### Logo not showing?

1. **Check file path**: Files must be in `public/` folder
2. **Restart dev server**: `npm run dev`
3. **Clear cache**: Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
4. **Check file names**: Must match exactly (case-sensitive)

### Logo looks blurry?

1. Use higher resolution images (400x400px for PNG)
2. Use SVG format for perfect scaling
3. Ensure `priority` prop is set for Next.js Image

### Logo wrong size?

Adjust the `width` and `height` in the Logo component:

```tsx
const sizes = {
  sm: { width: 32, height: 32, text: "text-lg" },
  md: { width: 44, height: 44, text: "text-xl" },
  lg: { width: 52, height: 52, text: "text-2xl" }, // Increased
};
```

---

## Alternative: Icon-Based Logo

If you prefer to keep an icon-based logo but customize it:

1. Find your icon at: https://lucide.dev/icons
2. Import it in the Logo component
3. Replace the `Image` component with your chosen icon

```tsx
import { Stethoscope } from "lucide-react";

// In the Logo component:
<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700">
  <Stethoscope className="h-6 w-6 text-white" strokeWidth={2.5} />
</div>
```

---

## Need Help?

If you need assistance:
1. Check that files are in `public/` folder
2. File names match exactly
3. Clear browser cache
4. Restart development server

---

**Version:** 1.0.0  
**Last Updated:** November 2025

