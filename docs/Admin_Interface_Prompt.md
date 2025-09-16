# Property Agent - Admin Interface Development Prompt

## Project Overview
You are designing the Admin Dashboard for the PropertyAgent application. The Admin role acts as a superuser with comprehensive oversight and intervention capabilities across the entire platform.

## Admin Role Responsibilities & Privileges

### 👥 **User Management**
**Current Status**: ✅ Fully Implemented

- **View All Users**: Complete visibility of Developers, Agents, and Buyers
- **Edit/Update User Details**: Modify user information, roles, and settings
- **Account Management**: Activate/deactivate accounts with proper confirmation
- **Issue Resolution**: Reset passwords and fix user-related problems
- **Role Management**: Change user roles with audit trail

### 🏗️ **Property / Project Management**
**Status**: 🔄 Needs Implementation

#### **Project Oversight**
- **View All Projects**: Complete list of projects created by all developers
- **Project Details**: Access to name, location, description, pricing, status
- **Edit Project Details**: Modify project information when needed
- **Developer Association**: Clear indication of project ownership

#### **Unit Management**
- **Unit Listings Overview**: View all units within projects
- **Override Unit Details**: Update unit information if inconsistencies exist
- **Status Management**: Mark units as available, reserved, or sold for corrections
- **Conflict Resolution**: Tools to resolve unit booking conflicts

### 📊 **Leads & Bookings Oversight**
**Status**: 🔄 Needs Implementation

#### **Leads Management**
- **View All Leads**: System-wide lead visibility
- **Advanced Filtering**:
  - By Agent (assigned agent)
  - By Developer (project developer)
  - By Project (specific project interest)
- **Lead Reassignment**: Transfer leads between agents
- **Status Override**: Update lead status when needed

#### **Bookings Monitoring**
- **Booking Overview**: All bookings across the platform
- **Status Tracking**:
  - Initiated (booking started)
  - Token Paid (initial payment made)
  - Confirmed (booking confirmed)
  - Cancelled (booking cancelled)
- **Buyer Details**: Complete buyer information and token amounts
- **Intervention Tools**:
  - Reassign booking to different agent
  - Reassign booking to different developer
  - Resolve conflicts between Agent/Developer/Buyer

## UI Layout Requirements

### **Dashboard Home** (`/admin/dashboard`)
**Current**: ✅ Basic user stats implemented
**Enhancement Needed**: Add project and booking metrics

- **Summary Cards**:
  - Total Users (Agents, Developers, Buyers) ✅
  - Total Projects (by status) 🆕
  - Total Leads (by status) 🆕
  - Total Bookings (by status) 🆕

### **Users Section** (`/admin/users`)
**Status**: ✅ Fully Implemented
- List + filters by role (Developer, Agent, Buyer)
- Search and advanced filtering
- User management actions

### **Projects Section** (`/admin/projects`) 🆕
**Status**: 🔄 Needs Implementation
- **Project List**: All projects with developer information
- **Project Filters**: By developer, status, location
- **Drill-down Capability**: Click project → view units
- **Unit Management**: Visual unit grid with status indicators

### **Leads & Bookings Section** (`/admin/leads-bookings`) 🆕
**Status**: 🔄 Needs Implementation
- **Tabbed Interface**: Leads tab and Bookings tab
- **Data Tables**: Sortable, filterable tables with action buttons
- **Action Buttons**: Reassign, Update Status, View Details
- **Search & Global Filters**: Quick access to information

## Design Considerations

### **Layout Principles**
- **Clean, Minimal, Professional**: Maintain current design standards
- **Role-based Navigation**: Clear separation of admin functions
- **Oversight Focus**: Admin is for supervision and fixing, not daily operations
- **Intervention Rights**: Tools for conflict resolution and system maintenance

### **Navigation Structure**
**Current**: Dashboard, Users, Logs, Settings, Profile
**Enhanced**: Dashboard, Users, Projects, Leads & Bookings, Logs, Settings, Profile

### **Color Scheme**
- **Primary**: Teal/Green (`primary-600: #016A5D`)
- **Admin Accent**: Red (`red-600`) for admin-specific elements
- **Status Colors**: 
  - Green for active/available/confirmed
  - Yellow for pending/reserved/in-progress
  - Red for inactive/cancelled
  - Blue for new/draft states

### **Component Patterns**
- **Cards**: White background, rounded-xl, shadow-sm, border
- **Tables**: Sortable headers, row hover states, action buttons
- **Filters**: Dropdown filters with clear/reset options
- **Status Badges**: Color-coded status indicators
- **Action Buttons**: Consistent button styles with icons

## Technical Implementation

### **New Routes Needed**
```
/admin/projects              - Project list and management
/admin/projects/:projectId   - Project details and unit management
/admin/leads-bookings        - Combined leads and bookings interface
/admin/leads/:leadId         - Individual lead details
/admin/bookings/:bookingId   - Individual booking details
```

### **New Components Required**
- `AdminProjects` - Project list with developer info
- `ProjectUnits` - Unit management interface
- `LeadsBookings` - Combined leads and bookings management
- `ConflictResolution` - Tools for resolving disputes
- `BulkActions` - Multi-select operations

### **Data Structures**
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
}

interface AdminLead {
  id: string;
  name: string;
  contact: string;
  assignedAgent?: Agent;
  interestedProject?: Project;
  status: LeadStatus;
}

interface AdminBooking {
  id: string;
  buyer: Buyer;
  agent: Agent;
  developer: Developer;
  project: Project;
  status: BookingStatus;
  tokenAmount: string;
}
```

## Security & Permissions

### **Admin Privileges**
- **Read Access**: All data across the platform
- **Edit Access**: User details, project information, unit status
- **Override Access**: Status changes, reassignments, conflict resolution
- **Audit Trail**: All admin actions logged with full details

### **Intervention Rights**
- **User Management**: Full CRUD operations
- **Project Oversight**: Edit details, manage units, resolve conflicts
- **Lead Management**: Reassign agents, update status
- **Booking Management**: Status override, reassignment, dispute resolution

### **Operational Boundaries**
- **Not for Daily Operations**: Admin is for oversight and fixing, not regular transactions
- **Intervention Focus**: Conflict resolution and system maintenance
- **Audit Everything**: All admin actions must be logged and traceable

## Implementation Priority

### **Phase 1**: Project Management
1. Admin project list with developer information
2. Project details and editing capabilities
3. Unit management interface with status controls

### **Phase 2**: Leads & Bookings Oversight
1. Combined leads and bookings interface
2. Filtering and search capabilities
3. Reassignment and conflict resolution tools

### **Phase 3**: Enhanced Dashboard
1. Project and booking metrics on dashboard
2. Quick action buttons for common tasks
3. Recent activity feed with all admin actions

## Success Criteria

### **Functional Requirements**
- Admin can view and manage all users, projects, leads, and bookings
- Conflict resolution tools work effectively
- All admin actions are logged and auditable
- Search and filtering provide quick access to information

### **Performance Requirements**
- Dashboard loads within 2 seconds
- Search results appear within 1 second
- Large data tables paginate efficiently
- Mobile interface remains responsive

### **Security Requirements**
- All admin actions require authentication
- Sensitive operations require confirmation
- Complete audit trail maintained
- Role-based access controls enforced

This Admin Interface provides comprehensive superuser functionality while maintaining clean, professional design and robust security measures. The focus is on oversight, intervention, and system maintenance rather than daily operational tasks.