# Property Agent - Admin Interface Development Prompt

## Project Overview
You are building a comprehensive Admin Interface for the Property Agent application - a real estate platform that connects agents, developers, and buyers. The admin interface provides system administrators with complete control over user management, system monitoring, and platform configuration.

## Current Implementation Status

### ✅ **Completed Features**

#### 1. **Admin Dashboard** (`/admin/dashboard`)
- **User Statistics Display**: Total users with breakdown by role (Agents: 89, Developers: 34, Buyers: 1124)
- **Quick Action Buttons**: "Manage Users" and "View Logs" with proper navigation
- **Pending Alerts Section**: 
  - Account lockout notifications with "Unlock" actions
  - Inactive user alerts (90+ days) with "Review" actions  
  - Role change requests with "Approve" actions
- **Recent Admin Actions**: Last 5 administrative actions with timestamps and action types
- **Role-based Navigation**: Admin-specific bottom navigation with red accent theme

#### 2. **User Management** (`/admin/users`, `/admin/agents`, `/admin/developers`, `/admin/buyers`)
- **Comprehensive User List**: Paginated display with search functionality
- **Role-based Filtering**: Separate views for All Users, Agents, Developers, Buyers
- **Real-time Search**: Search by name, email with instant results
- **User Cards Display**: Name, email, role badges, status indicators, join date, last login
- **Action Menus**: View Details, Edit User, Reset Password, Suspend/Reactivate options
- **Route-based Tab Selection**: Automatic tab selection based on URL path

#### 3. **User Details & Management** (`/admin/users/:userId`)
- **Detailed User Profiles**: Complete user information display
- **Contact Information**: Email, join date, last login, regional assignment
- **Role and Status Management**: Visual role badges and status indicators
- **Admin Action Buttons**: Edit, Reset Password, Suspend/Reactivate functionality
- **Account Information Section**: User ID, account type, status details

#### 4. **User Edit Functionality** (`/admin/users/:userId/edit`)
- **Form-based Editing**: Pre-populated forms with current user data
- **Editable Fields**: Full name, email, role (Agent/Developer/Buyer), status, region
- **Form Validation**: Required field validation, email format checking
- **Role Change Confirmation**: Dropdown with confirmation for role changes
- **Save/Cancel Actions**: Proper form submission and navigation

#### 5. **Audit Logs** (`/admin/logs`)
- **Comprehensive Log Display**: All admin actions with timestamps
- **Advanced Filtering**: By action type (suspend, reactivate, edit, view, reset)
- **Date Range Filtering**: Filter logs by time periods
- **Search Functionality**: Search across log entries
- **Detailed Log Entries**: Action type, target user, admin user, IP address, timestamps
- **Action Icons**: Visual indicators for different action types

#### 6. **System Settings** (`/admin/settings`)
- **General Settings**: Site name, description, currency, language configuration
- **Notification Settings**: Email, SMS, system notification toggles
- **User Management Policies**: Registration controls, auto-approval settings
- **Security Configuration**: Session timeout, login attempts, password policies
- **System Maintenance**: Maintenance mode, backup frequency, log retention

#### 7. **Admin Profile** (`/admin/profile`)
- **Admin Profile Display**: Name, email, role, permissions overview
- **Permission Management**: Visual display of admin permissions
- **Security Settings**: Password change, 2FA setup, session management
- **Quick Actions**: Links to user management, audit logs, system settings

### 🎨 **Design System**

#### **Color Scheme**
- **Primary**: Teal/Green (`primary-600: #016A5D`)
- **Admin Accent**: Red (`red-600`) for admin-specific elements
- **Gold Accent**: `#CBA135` for highlights
- **Neutral**: Gray scale for backgrounds and text

#### **Typography**
- **Font Family**: Montserrat (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700, 800, 900
- **Tracking**: Extra wide tracking for headings (`tracking-extra-wide`)

#### **Component Patterns**
- **Cards**: White background, rounded-xl, shadow-sm, border
- **Buttons**: Rounded-lg, proper hover states, transition-colors
- **Forms**: Neutral-50 backgrounds, rounded-xl inputs, focus rings
- **Navigation**: Bottom navigation with role-specific items

### 🔧 **Technical Architecture**

#### **Routing Structure**
```
/admin/dashboard          - Main admin dashboard
/admin/users             - All users management
/admin/agents            - Agent-specific user management
/admin/developers        - Developer-specific user management  
/admin/buyers            - Buyer-specific user management
/admin/users/:userId     - Individual user details
/admin/users/:userId/edit - Edit user information
/admin/logs              - Audit logs and system monitoring
/admin/settings          - System configuration
/admin/profile           - Admin profile management
```

#### **Component Architecture**
- **RoleBasedLayout**: Wrapper component handling role-specific navigation
- **AdminBottomNavigation**: Admin-specific bottom navigation
- **Role Switcher**: Development tool for testing different user roles
- **Responsive Design**: Mobile-first approach with proper breakpoints

#### **State Management**
- **React Hooks**: useState, useEffect for local state
- **URL-based State**: useLocation, useParams for navigation state
- **Mock Data**: Comprehensive mock data structure for development

### 📊 **Data Structure**

#### **User Management**
```typescript
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'developer' | 'buyer';
  status: 'active' | 'suspended' | 'inactive';
  lastLogin: string;
  joinedDate: string;
  region?: string;
}
```

#### **Admin Statistics**
```typescript
interface AdminStats {
  totalUsers: number;
  agents: number;
  activeAgents: number;
  developers: number;
  activeDevelopers: number;
  buyers: number;
  activeBuyers: number;
  suspendedUsers: number;
  newUsersThisMonth: number;
}
```

#### **Audit Logs**
```typescript
interface AuditLog {
  id: string;
  action: 'suspend' | 'reactivate' | 'reset' | 'edit' | 'view';
  description: string;
  targetUser: string;
  adminUser: string;
  timestamp: string;
  ipAddress?: string;
  details?: string;
}
```

## 🎯 **Development Guidelines**

### **Code Quality Standards**
1. **TypeScript**: Strict typing for all components and data structures
2. **Component Structure**: Functional components with proper prop typing
3. **Error Handling**: Comprehensive error boundaries and user feedback
4. **Performance**: Optimized rendering with proper key props and memoization
5. **Accessibility**: WCAG 2.1 compliance with proper ARIA labels

### **UI/UX Principles**
1. **Consistency**: Uniform design patterns across all admin pages
2. **Clarity**: Clear visual hierarchy and information organization
3. **Efficiency**: Quick access to frequently used functions
4. **Safety**: Confirmation dialogs for destructive actions
5. **Feedback**: Clear success/error messages for all actions

### **Security Considerations**
1. **Role-based Access**: Proper permission checking for all admin functions
2. **Audit Trail**: Complete logging of all administrative actions
3. **Data Protection**: Secure handling of sensitive user information
4. **Session Management**: Proper session timeout and security measures

### **Mobile Responsiveness**
1. **Breakpoints**: Mobile-first design with proper responsive breakpoints
2. **Touch Targets**: Appropriate button sizes for mobile interaction
3. **Navigation**: Mobile-optimized navigation patterns
4. **Performance**: Fast loading on mobile networks

## 🚀 **Future Enhancements**

### **Planned Features**
1. **Advanced Analytics**: User behavior analytics and system performance metrics
2. **Bulk Operations**: Multi-select and bulk actions for user management
3. **Export Functionality**: CSV/PDF export for audit logs and user data
4. **Real-time Notifications**: Live updates for system events
5. **Advanced Filtering**: More granular filtering options for all data views

### **Integration Points**
1. **Database Integration**: Supabase integration with RLS policies
2. **Authentication**: Supabase Auth integration with role-based access
3. **File Storage**: Document and image upload functionality
4. **Email Service**: Automated email notifications for admin actions

## 📝 **Implementation Notes**

### **Current Mock Data**
- All functionality currently uses comprehensive mock data
- Data structures are designed to match future database schema
- Realistic data volumes for testing (1000+ users, detailed logs)

### **Navigation Behavior**
- Role switcher in top-right for development/testing
- Bottom navigation with admin-specific red theme
- Proper back button navigation throughout the interface

### **Form Handling**
- Pre-populated forms with current data
- Proper validation and error handling
- Success/error feedback for all operations

### **Search and Filtering**
- Real-time search with debouncing
- Multiple filter combinations
- Clear filter states and reset options

This admin interface provides a solid foundation for system administration with room for future enhancements and integrations.