#!/bin/bash

# Script to replace remaining alerts with toast notifications

# List of files that still need alerts replaced
files=(
  "components/project-detail/BuyMeCoffee.jsx"
  "components/admin/projects/ProjectsManagement.jsx"
  "components/admin/products/ProductsManagement.jsx"
  "components/admin/orders/OrdersManagement.jsx"
  "components/e_commerce/OrderManagement.jsx"
  "components/student/MyProjectsPanel.jsx"
  "components/student/ProjectUpload.jsx"
)

echo "Files with remaining alerts:"
for file in "${files[@]}"; do
  echo "  - $file"
  grep -n "alert(" "$file" 2>/dev/null || echo "    No alerts found"
done
