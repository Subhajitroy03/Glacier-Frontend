# TODO - User Authentication & Profile Updates

## Task Summary
1. Move photo upload section to top of sign-up form and make it proper for uploading
2. Replace "Register as Official" button with user dashboard dropdown when logged in
3. Show user profile info (photo, name, email, position, department) in dropdown

## Implementation Plan

### Step 1: Update AuthModal.tsx
- [x] Move photo upload section to the top of the register form
- [x] Make photo upload more prominent with better styling
- [x] Add click-to-upload functionality with file input

### Step 2: Update TopNavbar.tsx
- [x] Add user state management (get from localStorage)
- [x] Create user dropdown menu component
- [x] Replace "Register as Official" button with user avatar/dropdown when logged in
- [x] Show user info (photo, name, email, position, department) in dropdown
- [x] Add logout functionality

### Step 3: Update Index.tsx
- [x] Add currentUser state management
- [x] Pass user state to TopNavbar
- [x] Update AuthModal to trigger user state change

### Step 4: Test and Verify
- [ ] Test photo upload at top of register form
- [ ] Test user login and dashboard button replacement
- [ ] Test dropdown shows correct user info
- [ ] Test logout functionality

## Files Modified
- `src/components/AuthModal.tsx` - Move photo upload to top
- `src/components/TopNavbar.tsx` - Add user dropdown
- `src/pages/Index.tsx` - User state management

## Status
- [ ] In Progress
- [x] Completed


