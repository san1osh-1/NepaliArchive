"""
Generates a placeholder 'old poster / painted archive' background so the
site has something evocative to sit behind while you swap in your real
photograph. Not a substitute for real archival artwork — see README note
in ArchiveBackdrop.jsx for how to replace it.
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 1920, 1200
rng = np.random.default_rng(7)

# Base warm gradient: charcoal top -> faded rust/gold horizon -> deep brown base
top = np.array([15, 13, 10])
mid = np.array([94, 55, 34])
bottom = np.array([20, 15, 11])

y = np.linspace(0, 1, H)[:, None, None]
top_to_mid = np.clip(y / 0.55, 0, 1)
mid_to_bottom = np.clip((y - 0.5) / 0.5, 0, 1)

grad = top[None, None, :] * (1 - top_to_mid) + mid[None, None, :] * top_to_mid
grad = grad * (1 - mid_to_bottom) + bottom[None, None, :] * mid_to_bottom
grad = np.repeat(grad, W, axis=1).astype(np.float32)

img = Image.fromarray(grad.astype(np.uint8), "RGB").convert("RGB")
draw = ImageDraw.Draw(img, "RGBA")

# Soft layered mountain silhouettes (suggestive, not literal / not tourism cliché)
def ridge(base_y, amplitude, color, alpha, seed):
    r = np.random.default_rng(seed)
    xs = np.linspace(0, W, 24)
    ys = base_y + r.normal(0, amplitude, size=xs.shape[0])
    ys = np.convolve(ys, np.ones(3) / 3, mode="same")
    pts = list(zip(xs, ys))
    pts = [(0, H), *pts, (W, H)]
    draw.polygon(pts, fill=(*color, alpha))

ridge(H * 0.62, 60, (10, 8, 7), 235, 1)
ridge(H * 0.7, 50, (18, 13, 10), 200, 2)
ridge(H * 0.78, 40, (30, 20, 14), 160, 3)

# A muted, low sun disc near the horizon
sun_x, sun_y, sun_r = int(W * 0.5), int(H * 0.46), 130
for i in range(sun_r, 0, -2):
    alpha = int(70 * (i / sun_r))
    draw.ellipse(
        [sun_x - i, sun_y - i, sun_x + i, sun_y + i],
        fill=(196, 138, 66, alpha),
    )

img = img.filter(ImageFilter.GaussianBlur(2))

# Fine paper/film grain
noise = rng.normal(0, 10, size=(H, W, 1)).astype(np.float32)
arr = np.asarray(img).astype(np.float32) + noise
arr = np.clip(arr, 0, 255).astype(np.uint8)
img = Image.fromarray(arr, "RGB")

# Vignette
vignette = Image.new("L", (W, H), 0)
vd = ImageDraw.Draw(vignette)
vd.ellipse([-W * 0.25, -H * 0.25, W * 1.25, H * 1.25], fill=255)
vignette = vignette.filter(ImageFilter.GaussianBlur(220))
dark = Image.new("RGB", (W, H), (5, 4, 3))
img = Image.composite(img, dark, vignette)

img.save("src/assets/background.jpg", quality=88)
print("saved", img.size)
