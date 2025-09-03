# Aggro PVP - DayZ Server Website

## Overview
This is a full-stack web application serving as the official website for the Aggro PVP DayZ gaming server. The application features a multi-page architecture with dedicated sections for server rules, joining instructions, donations, and community support. It provides a clean, post-apocalyptic aesthetic with authentic DayZ imagery and terminal-style interfaces. The home page features a minimal design with just the server logo against an apocalyptic wasteland background, while other pages contain comprehensive server information and community resources.

## Recent Changes (January 2025)
- **Enhanced Kill Feed System**: Improved suicide filtering using Steam IDs to prevent duplicate entries
- **Focused Leaderboard Categories**: Redesigned leaderboard with specific statistics:
  - Most Kills (with longest shot and favorite weapon details)
  - Longest Shots (distance rankings with weapon used)
  - K/D Ratio (accurate kill/death ratios excluding suicides)
  - Most Deaths (death counts from non-suicide kills only)
- **Death Tracking System**: Enhanced victim analysis in kill feed for accurate death statistics
- **Weather Integration**: Added current weather conditions to server information on join page
- **Safezone Rules Update**: Clarified safezone location to only Green Mountain (removed Bash reference)
- **Background Audio System**: Added atmospheric zombie sound component with user controls
- **Enhanced Webhook Processing**: Improved Discord embed parsing for Steam ID extraction and advanced suicide detection
- **Professional UI Enhancements**: Gold/silver/bronze ranking badges, enhanced statistical displays
- **Top 10 Leaderboard Limit**: Enforced maximum 10 entries for optimal performance across all categories
- **Steam Player Search System**: Comprehensive search by name or Steam ID with duplicate prevention
- **Data Integrity Framework**: Automated webhook duplicate detection and database consistency verification
- **Steam ID Consolidation**: Enhanced player tracking prevents duplicates when names change
- **Beta Warning System**: Added notices to inform users about potential bugs in kill feed and leaderboard features
- **Auto-Cleanup System**: Implemented automatic removal of "Unknown" entries from kill feed
- **CRITICAL ISSUE**: Server deployment blocked by vite.config.ts error (rootDir undefined) - prevents webhook processing and real-time updates

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The design features a dark, gaming aesthetic with red accent colors. UI components leverage shadcn/ui and Radix UI primitives. Typography uses Rajdhani for headings and Inter for body text. The overall visual theme is inspired by a post-apocalyptic Chernarus radio terminal, featuring Share Tech Mono fonts, rusted red accents, ash black backgrounds, and terminal-style UI. All buttons feature authentic weathered metal sign appearance with realistic gradients, rivets, and embossed text effects to match military equipment aesthetics. Enhanced background includes multiple atmospheric layers with smoke/fog effects for improved immersion.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Wouter for routing, Tailwind CSS for styling, TanStack Query for state management, and Vite for building.
- **Backend**: Node.js with Express.js, TypeScript, Drizzle ORM for PostgreSQL, and Neon Database (serverless PostgreSQL) for data storage. Session management uses `connect-pg-simple`.
- **Database Schema**: Managed by Drizzle ORM, with Zod for type-safe data validation.
- **Data Flow**: Client requests via TanStack Query are processed by Express.js, which interacts with PostgreSQL via Drizzle ORM. Responses are type-safe with error handling.

### Feature Specifications
- **Multi-Page Architecture**: Separate dedicated pages for Home, Rules, Join, Donate, and Support with individual routing and navigation.
- **Home Page**: Clean minimal design featuring only the server logo with apocalyptic DayZ wasteland background.
- **Rules System**: Complete server rules implementation with actual Discord content organized into General, Base Building, and Storage Limit sections.
- **Navigation**: Fixed header with multi-page routing between all sections.
- **Donation System**: A 3-tier system offering cosmetic-only perks (Priority Queue, Weapon Skins, Custom Clothing) compliant with Bohemia Interactive's Monetization Policy.
- **Server Data Integration**: Real-time server statistics (player count, status) via API polling on Join page.
- **Visual Design**: Enhanced glass card styling with colored borders, hover effects, and professional rule formatting.
- **Background System**: Unique apocalyptic backgrounds for each page (DayZ wasteland for home, radio terminal for support).
- **Asset Serving**: Secure serving of static assets with direct file path references.

## External Dependencies

- **Payment Processing**: PayPal Server SDK for donations.
- **Gaming Integrations**:
    - Steam protocol links for direct server connection.
    - Webhook integration for DayZ server kill feed (VPPAdminTools data parsing) and server status.
    - Steam API (for player avatars, with fallback).
- **Database**: Neon Database (PostgreSQL).
- **Development & Deployment**: Replit-specific configurations for development and autoscale deployment.
- **Fonts & Icons**: Google Fonts, Font Awesome.