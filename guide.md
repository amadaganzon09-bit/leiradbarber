# I Built an Award-Winning Website in 15 Minutes (0 Coding)

**For subject:** Cinematic product shot of matte black over-ear headphones, Zenith X, dramatic rim lighting, dark grey background, 8k resolution

**Prompt for start frame:** Ultra-premium product photography of sleek black over-ear headphones called “Zenith X” placed on a matte black surface, minimalistic studio photoshoot. Deep black background with subtle gradient falloff, soft rim lighting outlining the ear cups and headband, controlled reflections on smooth metal and leather textures. Cinematic lighting, high contrast, luxury tech aesthetic, sharp focus, shallow depth of field. No clutter, no text, no logos emphasized. Shot with a professional DSLR, 85mm lens, f/1.8, ultra-high resolution, photorealistic, Apple-level product shoot, dramatic mood, modern and elegant.

**Prompt for end frame:** Exploded technical diagram view of the same matte black over-ear headphones, every component precisely separated and floating in perfect alignment, suspended in mid-air against a deep black studio background. Visible internal structure including copper wiring, drivers, magnets, circuit boards, padding layers, and metal frame. Hyper-realistic product visualization, ultra-sharp focus, studio rim lighting identical to the hero shot, soft highlights tracing each component, controlled reflections on matte and metal surfaces. Cinematic lighting, high contrast, luxury engineering aesthetic, no labels, no annotations, no text. Photorealistic, ultra-high resolution, Apple-style industrial design render, dramatic and clean.

**Motion prompt:** Smoothly transition from the assembled product to the exploded view, slow motion

**Antigravity Prompt:**

```markdown
**ACT AS:**
A world-class Creative Developer (Awwwards-level) specializing in Next.js, Framer Motion, and 3D web interactions.

**THE TASK:**
Build a high-end "Scrollytelling" landing page for a fictional headphone brand called "Zenith X".
The core mechanic is a scroll-linked animation that plays an image sequence of headphones "exploding" (disassembling) as the user scrolls down.

**TECH STACK:**
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Animation: Framer Motion
- Rendering: HTML5 Canvas (for performance)

**VISUAL DIRECTION & COLOR:**
- **Seamless Blending:** The background of the website MUST match the background color of the image sequence exactly so the image edges are invisible.
- **Color Palette:** Pure Dark Mode. Use `#050505` (or eye-drop the image background) as the page background. Text should be `text-white/90` for headings and `text-white/60` for body.
- **Typography:** Inter or San Francisco. Clean, tracking-tight, minimalist.

**IMPLEMENTATION DETAILS:**

1.  **The "Sticky" Canvas:**
    - Create a component called `HeadphoneScroll.tsx`.
    - It should have a container with `h-[400vh]` (4x viewport height) to allow for a long scroll duration.
    - Inside, place a `<canvas>` element that is `sticky`, `top-0`, `h-screen`, and `w-full`.
    - Centered perfectly.

2.  **The Scroll Logic:**
    - Load a sequence of 120 images from `ezgif-split`. Naming convention: `frame_[i]_delay-0.04s.webp`.
    - Use `useScroll` from Framer Motion to map the user's scroll progress (000 to 001) to the image frame index (000 to 191).
    - Draw the current frame to the canvas on every scroll tick.
    - Ensure smooth interpolation so it doesn't stutter.

3.  **Text Overlays (The Story):**
    - Overlay text sections that fade in/out as the headphones explode.
    - **0% Scroll:** "Zenith X. Pure Sound." (Centered Title)
    - **30% Scroll:** "Precision Engineering." (Left aligned) -> *Headphones start expanding.*
    - **60% Scroll:** "Titanium Drivers." (Right aligned) -> *Headphones fully exploded showing internals.*
    - **90% Scroll:** "Hear Everything." (Centered CTA) -> *Headphones reassemble.*

4.  **Polish:**
    - Add a loading state (spinner) while the images pre-load to prevent flickering.
    - Ensure the canvas scales correctly on mobile (contain fit).

**OUTPUT:**
Generate the full code for `page.tsx`, `HeadphoneScroll.tsx`, and `globals.css`.

Use nano banana to generate UI components if needed


https://labs.google/fx/tools/whisk/

https://labs.google/fx/tools/flow/

https://ezgif.com/video-to-png
```