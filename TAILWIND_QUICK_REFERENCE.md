# Tailwind CSS Quick Reference - Finance Hub

## 🎨 **Visual Layout Guide**

### **App Selection Page - Desktop View (1024px+)**

```
┌─────────────────────────────────────────────────────────────┐
│                    Finance Hub                               │
│              Welcome, [Username]                             │
│        Select an application to get started                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  [Icon]  │  │  [Icon]  │  │ Coming   │  │  [Icon]  │   │
│  │          │  │          │  │  Soon    │  │          │   │
│  │ Chit     │  │  Daily   │  │ Finance  │  │  Ledger  │   │
│  │ Fund     │  │Collection│  │  Hub     │  │          │   │
│  │          │  │          │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────┐  ┌──────────┐                                │
│  │  [Icon]  │  │  [Icon]  │                                │
│  │          │  │          │                                │
│  │ Reports  │  │ Settings │                                │
│  │          │  │          │                                │
│  └──────────┘  └──────────┘                                │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│        © 2024 Treasure Finance Hub. All rights reserved.    │
└─────────────────────────────────────────────────────────────┘
```

### **Mobile View (< 640px)**

```
┌──────────────────┐
│   Finance Hub    │
│ Welcome, User    │
│  Select an app   │
├──────────────────┤
│                  │
│  ┌────────────┐  │
│  │   [Icon]   │  │
│  │ Chit Fund  │  │
│  └────────────┘  │
│                  │
│  ┌────────────┐  │
│  │   [Icon]   │  │
│  │   Daily    │  │
│  │ Collection │  │
│  └────────────┘  │
│                  │
│  ┌────────────┐  │
│  │  Coming    │  │
│  │   Soon     │  │
│  │  Finance   │  │
│  │    Hub     │  │
│  └────────────┘  │
│                  │
│      [...]       │
│                  │
├──────────────────┤
│   © 2024 ...     │
└──────────────────┘
```

---

## 🏷️ **Key Tailwind Classes Used**

### **1. App Selection Container**
```jsx
<div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
```
**What it does:**
- `min-h-screen` → Full viewport height
- `bg-white` → White background
- `px-4 py-8` → Mobile padding (16px horizontal, 32px vertical)
- `sm:px-6 lg:px-8` → Increases padding on larger screens
- `max-w-7xl` → Max width 1280px
- `mx-auto` → Centers horizontally

---

### **2. Header Section**
```jsx
<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-custom-red mb-2 tracking-tight">
  Finance Hub
</h1>
```
**Responsive Text Sizes:**
- Mobile (< 640px): `text-3xl` → 30px
- Tablet (640px+): `sm:text-4xl` → 36px  
- Desktop (1024px+): `lg:text-5xl` → 48px

---

### **3. App Cards Grid**
```jsx
<div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
```
**Responsive Columns:**
- Mobile (< 480px): `grid-cols-1` → 1 column
- Mobile (480px+): `xs:grid-cols-2` → 2 columns
- Tablet (768px+): `md:grid-cols-3` → 3 columns
- Desktop (1024px+): `lg:grid-cols-4` → 4 columns

---

### **4. Individual App Card**
```jsx
<div className="
  group relative bg-white border-2 rounded-xl p-5 sm:p-6
  transition-all duration-300 ease-in-out
  flex flex-col items-center text-center gap-3 sm:gap-4
  shadow-sm hover:shadow-lg
  border-custom-red cursor-pointer 
  hover:-translate-y-1 hover:border-custom-red-dark
">
```

**Breakdown:**
| Class | Purpose |
|-------|---------|
| `group` | Enables group-hover for children |
| `relative` | Position context for absolute children |
| `bg-white` | White background |
| `border-2` | 2px border |
| `border-custom-red` | Red border (#D32F2F) |
| `rounded-xl` | 12px border radius |
| `p-5 sm:p-6` | Padding (20px mobile, 24px tablet+) |
| `flex flex-col` | Vertical flexbox |
| `items-center` | Center items horizontally |
| `text-center` | Center text |
| `gap-3 sm:gap-4` | Space between items |
| `shadow-sm` | Small shadow |
| `hover:shadow-lg` | Large shadow on hover |
| `hover:-translate-y-1` | Lift up 4px on hover |
| `transition-all` | Smooth transitions |
| `duration-300` | 300ms transition |

---

### **5. Card Icon Container**
```jsx
<div className="
  w-14 h-14 sm:w-16 sm:h-16 
  rounded-xl flex items-center justify-center
  transition-all duration-300 shadow-md
  group-hover:scale-105
  bg-custom-red group-hover:bg-custom-red-dark
">
```

**Icon Sizes:**
- Mobile: `w-14 h-14` → 56px × 56px
- Tablet+: `sm:w-16 sm:h-16` → 64px × 64px

**Effects:**
- `group-hover:scale-105` → Grows 5% when card is hovered
- `bg-custom-red` → Red background
- `group-hover:bg-custom-red-dark` → Darker red on card hover

---

### **6. Coming Soon Badge**
```jsx
<div className="
  absolute top-2 right-2 sm:top-3 sm:right-3 
  bg-gray-700 text-white 
  text-[10px] sm:text-xs 
  font-semibold px-2 py-1 rounded 
  uppercase tracking-wide
">
  Coming Soon
</div>
```

---

## 🎯 **Color Reference**

### **Custom Colors:**
```javascript
// tailwind.config.js
colors: {
  'custom-red': '#D32F2F',        // Primary red
  'custom-red-dark': '#B71C1C',   // Hover red
}
```

### **Usage Examples:**
```jsx
// Text
className="text-custom-red"

// Background  
className="bg-custom-red"

// Border
className="border-custom-red"

// Hover
className="hover:bg-custom-red-dark"

// Gradient
className="bg-gradient-to-br from-custom-red to-custom-red-dark"
```

---

## 📐 **Spacing Scale**

Tailwind uses a consistent spacing scale (1 unit = 0.25rem = 4px):

| Class | Size | Pixels |
|-------|------|--------|
| `p-1` | 0.25rem | 4px |
| `p-2` | 0.5rem | 8px |
| `p-3` | 0.75rem | 12px |
| `p-4` | 1rem | 16px ✅ |
| `p-5` | 1.25rem | 20px ✅ |
| `p-6` | 1.5rem | 24px ✅ |
| `p-8` | 2rem | 32px ✅ |
| `p-10` | 2.5rem | 40px |

---

## 📱 **Responsive Breakpoints**

```javascript
// Tailwind default breakpoints
sm: '640px'   // Tablet
md: '768px'   // Medium tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // Extra large
```

### **How to Use:**
```jsx
// Mobile first - base styles apply to all sizes
className="text-base"

// Add tablet styles with sm:
className="text-base sm:text-lg"

// Add desktop styles with lg:
className="text-base sm:text-lg lg:text-xl"
```

---

## 🎨 **Common Patterns**

### **1. Card Component:**
```jsx
<div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
  {/* Content */}
</div>
```

### **2. Button:**
```jsx
<button className="
  bg-custom-red hover:bg-custom-red-dark 
  text-white font-semibold 
  px-6 py-3 rounded-lg 
  transition-colors duration-200
">
  Click Me
</button>
```

### **3. Flex Center:**
```jsx
<div className="flex items-center justify-center">
  {/* Centered content */}
</div>
```

### **4. Grid Layout:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Grid items */}
</div>
```

### **5. Responsive Text:**
```jsx
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Heading
</h1>
```

---

## 🔄 **Hover States**

### **Card Hover:**
```jsx
<div className="
  hover:-translate-y-1    // Lift up
  hover:shadow-lg         // Increase shadow
  hover:border-custom-red-dark  // Darker border
  transition-all duration-300
">
```

### **Group Hover (Parent-Child):**
```jsx
<div className="group">
  {/* Parent */}
  
  <div className="group-hover:scale-105">
    {/* Child responds to parent hover */}
  </div>
</div>
```

---

## 🎭 **Transitions & Animations**

### **Smooth Transitions:**
```jsx
className="transition-all duration-300 ease-in-out"
```

**Breakdown:**
- `transition-all` → Transition all properties
- `duration-300` → 300ms duration
- `ease-in-out` → Easing function

### **Transform Examples:**
```jsx
// Translate (move)
hover:-translate-y-1    // Up 4px
hover:translate-x-2     // Right 8px

// Scale (resize)
hover:scale-105         // Grow 5%
hover:scale-95          // Shrink 5%

// Rotate
hover:rotate-6          // Rotate 6°
```

---

## 📦 **Shadow Scale**

```jsx
shadow-none     // No shadow
shadow-sm       // Small shadow ✅
shadow          // Default shadow
shadow-md       // Medium shadow ✅
shadow-lg       // Large shadow ✅
shadow-xl       // Extra large
shadow-2xl      // Huge shadow
```

---

## 🎯 **Border Radius**

```jsx
rounded-none    // 0px
rounded-sm      // 2px
rounded         // 4px
rounded-md      // 6px
rounded-lg      // 8px ✅
rounded-xl      // 12px ✅
rounded-2xl     // 16px
rounded-3xl     // 24px
rounded-full    // 9999px (circle)
```

---

## 💡 **Pro Tips**

### **1. Mobile-First:**
Always start with mobile styles, then add larger breakpoints:
```jsx
// ✅ Good
className="p-4 sm:p-6 lg:p-8"

// ❌ Bad (desktop-first)
className="lg:p-8 sm:p-6 p-4"
```

### **2. Use Arbitrary Values When Needed:**
```jsx
className="text-[10px]"  // Custom size
className="w-[42px]"     // Custom width
```

### **3. Group Related Utilities:**
```jsx
// Layout
className="flex items-center justify-center gap-4"

// Styling
className="bg-white border-2 border-red-500 rounded-xl"

// Interactive
className="hover:bg-red-600 transition-all duration-300"
```

### **4. Use Tailwind IntelliSense:**
Install the VS Code extension for autocomplete and class suggestions!

---

## 🚀 **Quick Copy-Paste Snippets**

### **Red Button:**
```jsx
<button className="bg-custom-red hover:bg-custom-red-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
  Click Me
</button>
```

### **White Card with Red Border:**
```jsx
<div className="bg-white border-2 border-custom-red rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
  Card Content
</div>
```

### **Responsive Grid:**
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Items */}
</div>
```

### **Icon Container:**
```jsx
<div className="w-16 h-16 bg-custom-red rounded-xl flex items-center justify-center text-white">
  {/* Icon SVG */}
</div>
```

---

## 🎨 **Full Example - App Card:**

```jsx
<div className="
  group relative 
  bg-white border-2 border-custom-red 
  rounded-xl p-6 
  flex flex-col items-center text-center gap-4
  shadow-sm hover:shadow-lg
  transition-all duration-300 ease-in-out
  cursor-pointer
  hover:-translate-y-1 hover:border-custom-red-dark
">
  {/* Top border indicator */}
  <div className="
    absolute top-0 left-0 w-full h-1 
    bg-custom-red rounded-t-xl
    scale-x-0 group-hover:scale-x-100
    transition-transform duration-300 origin-left
  " />
  
  {/* Icon */}
  <div className="
    w-16 h-16 rounded-xl 
    bg-custom-red group-hover:bg-custom-red-dark
    flex items-center justify-center
    shadow-md transition-all duration-300
    group-hover:scale-105
  ">
    <svg className="w-8 h-8 text-white">
      {/* SVG path */}
    </svg>
  </div>
  
  {/* Content */}
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      App Name
    </h3>
    <p className="text-sm text-gray-600">
      Description text
    </p>
  </div>
</div>
```

---

**Happy Coding with Tailwind! 🎉**















