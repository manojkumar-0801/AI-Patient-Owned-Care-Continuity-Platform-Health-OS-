import os

base_dir = "d:/My_Project/AI-Patient/frontend/src"
dirs = [
    "api",
    "assets/images",
    "assets/icons",
    "assets/styles",
    "components/common",
    "components/layout",
    "components/ui",
    "features/auth",
    "features/patient",
    "features/doctor",
    "features/appointments",
    "features/records",
    "features/timeline",
    "features/notifications",
    "features/ai",
    "features/ml",
    "hooks",
    "layouts",
    "pages",
    "routes",
    "services",
    "store",
    "utils",
]

for d in dirs:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

print("Folder structure created.")
