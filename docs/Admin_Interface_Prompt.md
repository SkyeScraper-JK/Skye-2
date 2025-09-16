# Property Agent - Admin Interface Development Prompt

## Project Overview
You are building a comprehensive Admin Interface for the Property Agent application - a real estate platform that connects agents, developers, and buyers. The admin interface provides system administrators with complete superuser control over user management, project oversight, lead management, and platform configuration.

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

### 🚀 **Enhanced Superuser Functionality Requirements**

## Admin Role Responsibilities & Privileges

### 👥 **User Management (Enhanced)**
**Current Status**: ✅ Fully Implemented
- View all users (Developers, Agents, Buyers) with comprehensive filtering
- Edit/update user details with form validation
- Activate/deactivate accounts with confirmation dialogs
- Reset passwords with email notifications
- Role management with audit trail

### 🏗️ **Property / Project Management (New)**
**Status**: 🔄 Needs Implementation

#### **Project Oversight** (`/admin/projects`)
- **View All Projects**: Complete list of projects created by all developers
- **Project Details**: Name, location, description, pricing, status
- **Developer Association**: Clear indication of which developer owns each project
- **Project Status Management**: Ability to change project status (Planning, Under Construction, Ready, Completed)
- **Project Search & Filtering**: By developer, location, status, date range

#### **Project Edit Functionality** (`/admin/projects/:projectId/edit`)
- **Edit Project Details**: Name, location, description, pricing
- **Status Override**: Admin can override project status if needed
- **Developer Reassignment**: Ability to reassign project to different developer (with audit trail)
- **Project Visibility Control**: Make projects public/private/draft

#### **Unit Management** (`/admin/projects/:projectId/units`)
- **Unit Listings Overview**: All units within a project
- **Unit Status Management**: Override unit status (Available, Reserved, Sold, Blocked)
- **Unit Details Edit**: Update unit details if inconsistencies exist
- **Bulk Unit Operations**: Mark multiple units with same status
- **Unit Availability Grid**: Visual grid showing unit status by floor
- **Conflict Resolution**: Tools to resolve unit booking conflicts

### 📊 **Leads & Bookings Oversight (New)**
**Status**: 🔄 Needs Implementation

#### **Leads Management** (`/admin/leads`)
- **View All Leads**: Complete system-wide lead visibility
- **Advanced Filtering**:
  - By Agent (assigned agent)
  - By Developer (project developer)
  - By Project (specific project interest)
  - By Status (New, Contacted, Qualified, Converted, Lost)
  - By Lead Quality (Hot, Warm, Cold)
  - By Date Range
- **Lead Details**: Contact info, preferences, interaction history
- **Lead Reassignment**: Transfer leads between agents
- **Lead Status Override**: Admin can update lead status
- **Bulk Lead Operations**: Assign multiple leads to agents

#### **Bookings Management** (`/admin/bookings`)
- **Booking Overview**: All bookings across the platform
- **Booking Status Monitoring**:
  - Initiated (booking started)
  - Token Paid (initial payment made)
  - Confirmed (booking confirmed)
  - Agreement Signed (legal documents completed)
  - Cancelled (booking cancelled)
- **Buyer Details**: Complete buyer information and contact details
- **Token Amount Tracking**: Payment amounts and schedules
- **Conflict Resolution Tools**:
  - Reassign booking to different agent
  - Reassign booking to different developer
  - Resolve buyer-agent-developer conflicts
  - Override booking status if needed

#### **Lead-Booking Analytics** (`/admin/analytics`)
- **Conversion Metrics**: Lead to booking conversion rates
- **Agent Performance**: Leads handled vs bookings closed
- **Developer Performance**: Project interest vs actual bookings
- **Revenue Tracking**: Total booking values and payment status

### 🎨 **Enhanced UI Layout**

#### **Dashboard Home** (`/admin/dashboard`)
**Current**: ✅ Implemented with basic stats
**Enhancement Needed**: 🔄 Add project and booking metrics

- **Summary Cards**:
  - Total Users (Agents, Developers, Buyers) ✅
  - Total Projects (by status) 🆕
  - Total Leads (by quality/status) 🆕
  - Total Bookings (by status) 🆕
  - Revenue Metrics 🆕
- **Quick Actions**: Enhanced with project and booking management
- **Recent Activity**: Include project updates and booking activities

#### **Navigation Structure**
**Current**: Users, Logs, Settings, Profile
**Enhanced**: Users, Projects, Leads, Bookings, Analytics, Logs, Settings, Profile

#### **Users Section** (`/admin/users`)
**Status**: ✅ Fully Implemented
- List + filters by role (Developer, Agent, Buyer)
- Search and advanced filtering
- User management actions

#### **Projects Section** (`/admin/projects`) 🆕
**Status**: 🔄 Needs Implementation
- **Project List**: All projects with developer info
- **Project Filters**: By developer, status, location
- **Drill-down Capability**: Click project → view units
- **Unit Management**: Visual unit grid with status indicators
- **Project Actions**: Edit, Status Change, Developer Reassignment

#### **Leads & Bookings Section** (`/admin/leads`, `/admin/bookings`) 🆕
**Status**: 🔄 Needs Implementation
- **Tabbed Interface**: Leads tab and Bookings tab
- **Data Tables**: Sortable, filterable tables
- **Action Buttons**: Reassign, Update Status, View Details
- **Bulk Operations**: Select multiple items for bulk actions
- **Search & Filters**: Global search with advanced filtering

### 🔧 **Technical Implementation Requirements**

#### **New Routes Needed**:
```
/admin/projects              - Project list and management
/admin/projects/:projectId   - Project details
/admin/projects/:projectId/edit - Edit project
/admin/projects/:projectId/units - Unit management
/admin/leads                 - Lead management
/admin/leads/:leadId         - Lead details
/admin/bookings              - Booking management
/admin/bookings/:bookingId   - Booking details
/admin/analytics             - Analytics dashboard
```

#### **New Components Needed**:
- `ProjectManagement` - Project list and filtering
- `ProjectDetails` - Individual project view
- `UnitGrid` - Visual unit availability grid
- `LeadManagement` - Lead list and assignment tools
- `BookingManagement` - Booking oversight and conflict resolution
- `AdminAnalytics` - Metrics and reporting dashboard
- `BulkActions` - Multi-select and bulk operation tools

#### **Enhanced Data Structures**:
```typescript
interface AdminProject {
  id: string;
  name: string;
  developer: Developer;
  location: string;
  status: ProjectStatus;
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  revenue: string;
  createdAt: string;
}

interface AdminLead {
  id: string;
  name: string;
  contact: string;
  assignedAgent?: Agent;
  interestedProject?: Project;
  status: LeadStatus;
  quality: LeadQuality;
  lastInteraction: string;
}

interface AdminBooking {
  id: string;
  buyer: Buyer;
  agent: Agent;
  developer: Developer;
  project: Project;
  unit: Unit;
  status: BookingStatus;
  tokenAmount: string;
  totalAmount: string;
  bookingDate: string;
}
```

### 🎨 **Design System**

#### **Color Scheme**
- **Primary**: Teal/Green (`primary-600: #016A5D`)
- **Admin Accent**: Red (`red-600`) for admin-specific elements
- **Gold Accent**: `#CBA135` for highlights
- **Status Colors**: 
  - Green for active/available/confirmed
  - Yellow for pending/reserved/in-progress
  - Red for inactive/sold/cancelled
  - Blue for new/draft states

#### **Typography**
- **Font Family**: Montserrat (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700, 800, 900
- **Tracking**: Extra wide tracking for headings (`tracking-extra-wide`)

#### **Component Patterns**
- **Cards**: White background, rounded-xl, shadow-sm, border
- **Tables**: Sortable headers, row hover states, action buttons
- **Filters**: Dropdown filters with clear/reset options
- **Status Badges**: Color-coded status indicators
- **Action Buttons**: Consistent button styles with icons

### 🔐 **Security & Permissions**

#### **Admin Privileges**:
- **Read Access**: All data across the platform
- **Edit Access**: User details, project information, unit status
- **Override Access**: Status changes, reassignments, conflict resolution
- **Audit Trail**: All admin actions logged with full details

#### **Intervention Rights**:
- **User Management**: Full CRUD operations
- **Project Oversight**: Edit details, change status, reassign ownership
- **Lead Management**: Reassign agents, update status, resolve conflicts
- **Booking Management**: Status override, reassignment, conflict resolution

#### **Operational Boundaries**:
- **Not for Daily Operations**: Admin is for oversight and fixing, not regular transactions
- **Intervention Focus**: Conflict resolution and system maintenance
- **Audit Everything**: All admin actions must be logged and traceable

### 📱 **Mobile Responsiveness**
- **Dashboard**: Responsive cards and metrics
- **Tables**: Horizontal scroll on mobile with essential columns
- **Filters**: Collapsible filter panels
- **Actions**: Touch-friendly buttons and menus

### 🚀 **Implementation Priority**

#### **Phase 1**: Project Management
1. Admin project list and details
2. Project editing capabilities
3. Unit management interface

#### **Phase 2**: Lead & Booking Oversight
1. Lead management interface
2. Booking oversight dashboard
3. Reassignment and conflict resolution tools

#### **Phase 3**: Analytics & Reporting
1. Admin analytics dashboard
2. Performance metrics
3. Revenue tracking

#### **Phase 4**: Enhanced Features
1. Bulk operations
2. Advanced filtering
3. Export capabilities

### 🎯 **Success Criteria**

#### **Functional Requirements**:
- Admin can view and manage all users, projects, leads, and bookings
- Conflict resolution tools work effectively
- All admin actions are logged and auditable
- Search and filtering provide quick access to information

#### **Performance Requirements**:
- Dashboard loads within 2 seconds
- Search results appear within 1 second
- Large data tables paginate efficiently
- Mobile interface remains responsive

#### **Security Requirements**:
- All admin actions require authentication
- Sensitive operations require confirmation
- Complete audit trail maintained
- Role-based access controls enforced

This enhanced Admin Interface provides comprehensive superuser functionality while maintaining the clean, professional design and robust security measures of the existing system.