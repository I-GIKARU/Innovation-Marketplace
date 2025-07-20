# 🧪 Innovation Marketplace API Test



## 📁 **Test Organization**

```
tests/
├── auth/              # 🔐 Authentication & User Management
├── projects/          # 📁 Project CRUD & Browsing
├── user-interactions/ # 👥 Interactions & Reviews
├── dashboards/        # 📊 Role-specific Dashboards
├── merchandise/       # 🛍️ Product Catalog & Inventory
├── orders/            # 📦 Order Management & E-commerce
├── admin/             # ⚙️ Administrative Controls
└── README.md          # This file
```

## 🚀 **Quick Start Guide**

### **Step 1: Start Server**
### python app.py
```

### **Step 2: Run Tests in Order**
1. **`auth/auth_tests.http`** - Create users & login (sets HttpOnly cookies)
2. **`projects/project_tests.http`** - Create and manage projects
3. **`user-interactions/interactions_tests.http`** - Test user interactions
4. **`merchandise/merchandise_tests.http`** - Setup product catalog
5. **`orders/order_tests.http`** - Test e-commerce functionality
6. **`admin/admin_tests.http`** - Administrative operations
7. **`dashboards/dashboard_tests.http`** - View role-specific data

## 🎯 **Testing Workflow**

### **Authentication Flow:**
```
1. Register Users → 2. Login → 3. Test Protected Endpoints → 4. Logout
```

### **User Roles:**
- **👨‍🎓 Students** - Create projects, collaborate
- **🏢 Clients** - Buy projects, hire developers  
- **⚙️ Admins** - Moderate content, manage system
- **👤 Users** - Basic access level

### **E-commerce Flow:**
```
1. Admin creates merchandise → 2. Users place orders → 3. Order management
```

## 📊 **Coverage Summary**

| Category | Endpoints | Status |
|----------|-----------|---------|
| **Authentication** | 6 | ✅ Complete |
| **Projects** | 8 | ✅ Complete |
| **User Interactions** | 5 | ✅ Complete |
| **Dashboards** | 3 | ✅ Complete |
| **Merchandise** | 4 | ✅ Complete |
| **Orders** | 8 | ✅ Complete |
| **Admin Operations** | 13 | ✅ Complete |
| **TOTAL** | **47** | **✅ 100%** |

## 🎉 **Success!**

```
All tests passed successfully!
```
