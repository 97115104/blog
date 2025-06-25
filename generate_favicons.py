#!/usr/bin/env python3
import os
import subprocess
import sys

# Check if required tools are installed
def check_dependencies():
    try:
        subprocess.run(['convert', '--version'], capture_output=True, check=True)
    except:
        print("ImageMagick is required. Install with: brew install imagemagick")
        sys.exit(1)

def generate_favicons():
    svg_path = "assets/favicon.svg"
    favicon_dir = "assets/favicons"
    
    # Ensure favicon directory exists
    os.makedirs(favicon_dir, exist_ok=True)
    
    # Define sizes needed
    sizes = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
        "android-chrome-192x192.png": 192,
        "android-chrome-512x512.png": 512,
        "mstile-150x150.png": 150
    }
    
    # Generate each size
    for filename, size in sizes.items():
        output_path = os.path.join(favicon_dir, filename)
        cmd = [
            'convert',
            '-background', 'none',
            '-resize', f'{size}x{size}',
            '-gravity', 'center',
            '-extent', f'{size}x{size}',
            svg_path,
            output_path
        ]
        
        print(f"Generating {filename}...")
        subprocess.run(cmd, check=True)
    
    # Generate ICO file with multiple sizes
    ico_sizes = [16, 32, 48]
    ico_files = []
    
    for size in ico_sizes:
        temp_file = f"temp_{size}.png"
        cmd = [
            'convert',
            '-background', 'none',
            '-resize', f'{size}x{size}',
            '-gravity', 'center',
            '-extent', f'{size}x{size}',
            svg_path,
            temp_file
        ]
        subprocess.run(cmd, check=True)
        ico_files.append(temp_file)
    
    # Combine into ICO
    ico_path = os.path.join(favicon_dir, "favicon.ico")
    cmd = ['convert'] + ico_files + [ico_path]
    subprocess.run(cmd, check=True)
    
    # Clean up temp files
    for temp_file in ico_files:
        os.remove(temp_file)
    
    print("All favicons generated successfully!")

if __name__ == "__main__":
    check_dependencies()
    generate_favicons()