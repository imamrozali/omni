# Omni Platform Architecture & Engineering Standards

**Status:** Source of Truth
**Role:** Technical Design Document & Engineering Standards
**Scope:** Architecture, engineering standards, development rules, security, quality, deployment, and future modules
**Priority:** Highest
**Applies To:** `agent`, `server`, `console`, `storage`, and all future modules

---

# 1. MISSION

Build Omni as a clean, modular, maintainable, reusable, type-safe, secure, accessible, observable, and scalable software platform.

This document is the **primary technical specification and engineering architecture** of the project.

Every future:

* implementation
* RFC / proposal
* task
* feature
* refactor
* module
* service
* infrastructure
* architectural decision

MUST follow this document.

The goal is not to build the largest architecture.

The goal is to build the:

> **smallest architecture that is correct, maintainable, reusable, secure, and capable of growing.**

Complexity must always be justified.

---

# 2. SOURCE OF TRUTH

Engineering hierarchy:

```text
Core Architecture & Standards
   ↓
Service & Module Design
   ↓
Implementation Tasks
   ↓
Code
```

Priority:

```text
Architecture & Standards
   >
Feature Specifications
   >
Tasks
   >
Implementation Details
```

A future feature or PR MUST NOT silently change a rule defined by this specification.

If a future requirement conflicts with the core architecture:

1. identify the conflict
2. do not silently bypass the rule
3. inspect the existing architecture
4. determine whether the existing architecture can solve it
5. prefer the existing architecture when reasonable
6. change the foundation only when genuinely necessary
7. document the architectural reason
8. update this specification if the new architecture becomes permanent

---

# 3. CORE ENGINEERING PRINCIPLES

All development MUST follow:

1. Simplicity
2. Modularity
3. Reusability
4. Separation of concerns
5. Type safety
6. Explicitness
7. Accessibility
8. Security
9. Observability
10. Maintainability
11. Controlled scalability

---

## 3.1 Simplicity

Prefer the simplest correct solution.

Do not introduce complexity because it is technically possible.

---

## 3.2 Modularity

Every responsibility must have a clear owner.

A module/service should be independently understandable and maintainable.

---

## 3.3 Reusability

Reuse existing:

* components
* hooks
* services
* repositories
* utilities
* schemas
* protocols
* types
* abstractions

Do not create duplicate implementations.

---

## 3.4 Separation of Concerns

Clearly separate:

```text
UI
Business Logic
Application Services
Infrastructure
Persistence
Communication
System Integration
Storage
```

---

## 3.5 Type Safety

TypeScript and Rust must provide strong compile-time guarantees.

Avoid unnecessary:

```text
any
unknown without validation
unsafe casts
untyped external payloads
```

External input must be validated before entering trusted application logic.

---

## 3.6 Explicitness

Prefer explicit contracts and predictable behavior over magic abstractions.

---

## 3.7 Accessibility

Accessibility is part of implementation.

It is not a post-development enhancement.

---

## 3.8 Security

Security exists at architectural boundaries.

Never depend only on:

* frontend validation
* hidden UI
* disabled controls
* client state
* client-provided permissions

Backend and service boundaries remain authoritative.

---

## 3.9 Observability

Important operations must be traceable through:

* structured logs
* request IDs
* correlation IDs
* message IDs
* service context
* meaningful error codes

---

## 3.10 Maintainability

Code must be understandable by another engineer without requiring hidden knowledge.

---

# 4. NON-NEGOTIABLE RULES

## 4.1 No Unnecessary Dependencies

Do not add a library unless:

* the requirement genuinely needs it
* existing dependencies cannot reasonably solve it
* maintenance cost is justified
* it fits the architecture

---

## 4.2 No Duplicate Capabilities

Before creating:

* component
* hook
* utility
* service
* repository
* store
* schema
* protocol
* helper
* abstraction

check existing implementation first.

Reuse or extend where appropriate.

---

## 4.3 No Giant Modules

Avoid:

* giant React components
* giant Zustand stores
* giant Fastify routes
* giant services
* giant repositories
* giant Rust commands
* giant utility files

Split responsibilities when complexity becomes difficult to understand or test.

---

## 4.4 No Premature Abstraction

Do not create abstractions only because something might become reusable.

Create an abstraction when:

* reuse already exists
* responsibility is clearly shared
* consistency improves
* the boundary is meaningful

---

## 4.5 No Architecture for Architecture's Sake

Do not create layers merely to appear enterprise-grade.

Every layer must have a real responsibility.

---

## 4.6 No Cross-Layer Shortcuts

Prohibited:

```text
Route → Database
Component → Database
Component → Rust
Component → WebSocket lifecycle
Repository → HTTP response
Rust command → UI implementation details
Feature → filesystem directly
Feature → storage filesystem directly
Server → storage filesystem directly
```

---

## 4.7 No Random Environment Access

Environment variables must not be accessed throughout application code.

Use centralized validated configuration.

---

## 4.8 No Secrets in Client Applications

Never expose:

* database credentials
* private API keys
* server secrets
* signing secrets
* internal credentials

inside:

```text
agent
console
Vite bundles
VITE_* variables
```

---

## 4.9 No Silent Architectural Changes

Do not introduce a new architecture pattern without documenting why.

---

## 4.10 Prefer Existing Patterns

Always:

```text
Inspect
  ↓
Reuse
  ↓
Extend
  ↓
Create only if necessary
```

---

# 5. RUNTIME & TECHNOLOGY STANDARD

All Node.js applications MUST use:

```text
Node.js 24
```

Supported:

```text
>=24 <25
```

npm:

```text
>=10 <11
```

Node applications must enforce runtime through:

```text
.nvmrc
package.json engines
```

---

# 6. TECHNOLOGY STACK

## 6.1 Agent

```text
Node.js 24
TypeScript
React 19
Vite
Tailwind CSS
Zustand
Tauri 2
Rust
WebSocket
```

---

## 6.2 Server

```text
Node.js 24
TypeScript
Fastify
Drizzle ORM
PostgreSQL
Zod
@fastify/websocket
@fastify/cors
Drizzle Kit
Drizzle Studio
```

---

## 6.3 Storage

Storage is a **first-class backend service**.

```text
Node.js 24
TypeScript
Fastify
Zod
Filesystem / Persistent Storage
```

Storage is responsible for asset/file operations.

It is not responsible for application business logic.

Storage must be capable of serving large binary assets efficiently without forcing the Server to proxy every byte.

---

## 6.4 Console

```text
Node.js 24
TypeScript
React 19
Vite
Tailwind CSS
Zustand
REST / HTTP
```

---

## 6.5 Engineering Tools

```text
ESLint
Prettier
TypeScript strict mode
Vitest
```

---

## 6.6 Explicitly Not Used

Unless this specification is explicitly revised:

```text
Next.js
NestJS
Redux Toolkit
Redis
Docker
```

Do not introduce these because of popularity or convenience.

---

# 7. REPOSITORY ARCHITECTURE

Canonical root:

```text
omni/

├── agent/
├── console/
├── storage/
├── server/

├── .nvmrc
├── package.json
├── .gitignore
└── README.md
```

The four primary application boundaries are:

```text
agent/
console/
storage/
server/
```

Each is a first-class application boundary.

---

# 8. APPLICATION / SERVICE BOUNDARIES

Omni consists of four primary boundaries.

```text
                         OMNI

        ┌────────────────┼────────────────┐
        │                │                │
      Agent           Console          Server
                                          │
                                          │
                                       Storage
```

Logical relationships:

```text
Agent
  │
  ├── control / commands ──→ Server
  │
  └── large media data ────→ Storage

Console
  │
  ├── control / metadata ──→ Server
  │
  └── authorized media ────→ Storage

Server
  │
  └── Storage control/API ──→ Storage
```

The architecture distinguishes between:

```text
CONTROL PLANE
DATA PLANE
```

This distinction is mandatory for large media operations.

---

# 9. AGENT RESPONSIBILITY

Agent owns:

* desktop UI
* local application state
* local application services
* native system interaction
* Tauri integration
* Rust integration
* WebSocket client
* local print workflow
* local device interaction

Agent does not own:

* server business rules
* database access
* backend authorization
* persistent server storage
* storage filesystem access

Agent may transfer large media directly to Storage only through an authorized Storage API/session.

---

# 10. SERVER RESPONSIBILITY

Server owns:

* HTTP API
* authentication
* authorization
* business logic
* application orchestration
* database access
* persistence metadata
* WebSocket gateway
* validation
* security policy
* system-level orchestration
* storage authorization orchestration
* upload/download session authorization

Server is the authoritative business layer.

Server does **not** need to proxy large binary media by default.

---

# 11. CONSOLE RESPONSIBILITY

Console owns:

* operator UI
* admin UI
* frontend state
* HTTP communication
* reusable administrative interfaces

Console does not own backend business rules.

Console does not directly access:

```text
Database
Storage filesystem
Rust
OS
```

Console may access Storage media directly when the Server has authorized the operation.

---

# 12. STORAGE RESPONSIBILITY

Storage is a dedicated Fastify service responsible for file and asset operations.

Storage owns:

* file upload
* file validation
* file persistence
* file retrieval
* file streaming
* file deletion
* file replacement
* temporary storage
* asset lifecycle
* storage metadata relevant to physical files
* storage-level security
* storage-level cache behavior
* controlled media delivery

Storage does NOT own:

* user business logic
* application authentication policy
* application authorization policy
* application workflows
* database business rules
* feature-specific business decisions

The Server remains the business authority.

---

# 13. SERVICE COMMUNICATION

The architecture uses two related planes.

## 13.1 Control Plane

```text
Agent
  ↓
Server
```

```text
Console
  ↓
Server
```

```text
Server
  ↓
Storage API
```

Control-plane operations include:

* authentication
* authorization
* business operations
* asset creation
* asset ownership
* metadata
* upload authorization
* download authorization
* deletion authorization
* print jobs
* agent commands
* workflow orchestration

---

## 13.2 Data Plane

Large binary media should preferably travel directly:

```text
Agent
  │
  │ upload/download
  ▼
Storage
```

or:

```text
Console
  │
  │ upload/download
  ▼
Storage
```

after authorization has been established by Server.

Preferred architecture:

```text
                 CONTROL PLANE

Agent ───────────────→ Server
                         │
Console ────────────────→│
                         │
                         ↓
                      Storage


                  DATA PLANE

Agent ─────────────────────→ Storage
Console ────────────────────→ Storage
```

The Server should not become a binary proxy unless there is a specific architectural reason.

---

## 13.3 Why Large Files Bypass Server

Media workloads may include:

```text
original images
processed images
GIF
burst GIF
video
live video stream
frame assets
thumbnails
print assets
```

If a 20 MB file is sent:

```text
Agent → Server → Storage
```

the Server receives and transmits the same binary data.

For large concurrent uploads this creates unnecessary:

* bandwidth usage
* memory pressure
* CPU/network overhead
* connection duration
* Server bottleneck
* failure surface

Preferred:

```text
Agent → Storage
```

with Server remaining responsible for authorization and metadata.

---

# 14. SERVER ARCHITECTURE

Server dependency direction:

```text
Route
  ↓
Service
  ↓
Repository
  ↓
Database
```

For storage:

```text
Server Service
  ↓
Storage Client
  ↓
Storage API
```

Storage is an external infrastructure boundary from the Server's perspective.

---

## 14.1 Route

Responsible for:

* HTTP transport
* request extraction
* validation
* calling services
* response formatting

Routes must not contain business logic.

---

## 14.2 Service

Responsible for:

* business logic
* orchestration
* business rules
* application workflows
* calling repositories
* calling public module/service interfaces
* communicating with infrastructure services
* creating authorized storage operations

Services must not depend on Fastify request/response objects.

---

## 14.3 Repository

Responsible for:

* database access
* Drizzle queries
* persistence operations

Repositories must not contain business logic.

---

# 15. SERVER MODULE STRUCTURE

Feature-oriented:

```text
server/src/modules/

├── auth/
├── agents/
├── media/
├── assets/
├── health/
└── ...
```

A module may contain:

```text
module/

├── route.ts
├── service.ts
├── repository.ts
├── schema.ts
├── types.ts
└── tests/
```

Modules own their responsibility.

Modules must not directly access another module's private repository.

Cross-module communication uses:

```text
public service
interface
explicit contract
```

---

# 16. SERVER FOUNDATION

Infrastructure:

```text
server/src/

├── app/
├── plugins/
├── shared/
├── db/
├── websocket/
├── security/
└── modules/
```

Responsibilities include:

* bootstrap
* configuration
* plugins
* database initialization
* errors
* logging
* validation
* security
* authentication
* authorization
* WebSocket infrastructure
* Storage client infrastructure

`shared/` must remain genuinely shared.

---

# 17. STORAGE ARCHITECTURE

`storage/` is a first-class Fastify application.

It is:

* not a passive folder
* not a generic external CDN
* not a database
* not a second business backend

It is a specialized:

> **Storage Service / Controlled Media Delivery Service**

The service may provide CDN-like delivery behavior, but it remains controlled by Omni.

---

# 18. STORAGE STRUCTURE

Canonical structure:

```text
storage/

├── src/

│   ├── app/
│   ├── modules/
│   ├── plugins/
│   ├── storage/
│   ├── security/
│   ├── config/
│   └── index.ts

├── package.json
├── tsconfig.json
└── README.md
```

Runtime storage data is NOT required to live inside the repository.

Development may use:

```text
storage/.data/
```

Production should use a configured persistent location such as:

```text
/var/lib/omni/storage
```

through:

```text
STORAGE_ROOT
```

The source tree and runtime media must remain separate.

---

# 19. STORAGE API BOUNDARY

Storage exposes a controlled API.

Examples:

```text
POST   /internal/v1/files
GET    /internal/v1/files/:id
DELETE /internal/v1/files/:id
```

Controlled media delivery may use:

```text
GET /cdn/:storageKey
```

or an equivalent opaque asset identifier.

Exact endpoints may evolve.

The architecture must remain:

```text
Client / Server
      ↓
Storage API
      ↓
Storage Service
      ↓
Storage Provider
      ↓
Persistent Storage
```

---

# 20. STORAGE DATA PLANE

Storage is optimized to handle binary data directly.

Large file flow:

```text
1. Client requests upload authorization
2. Server authenticates client
3. Server validates business permission
4. Server creates/authorizes upload session
5. Client receives controlled Storage upload target
6. Client uploads directly to Storage
7. Storage validates and persists binary data
8. Storage returns storage result
9. Server records/updates business metadata
```

The Server does not need to receive the binary body.

---

## 20.1 Upload Session

An upload session should contain only the information required to safely perform the upload.

Example:

```json
{
  "uploadId": "upl_abc123",
  "assetId": "asset_xyz789",
  "expiresAt": "2026-09-13T03:00:00Z",
  "maxSize": 20971520,
  "allowedMimeTypes": [
    "image/jpeg",
    "image/png",
    "image/webp"
  ]
}
```

Do not expose:

* filesystem paths
* server secrets
* internal credentials
* unrestricted write capability

---

## 20.2 Upload Authorization

An upload target must be:

* scoped
* time-limited where appropriate
* size-limited
* type-limited
* associated with the intended asset/session
* non-reusable where practical

A client must never receive unrestricted filesystem write access.

---

# 21. STORAGE SECURITY

Storage must never trust client-controlled physical paths.

Never accept:

```text
../../
../../../
/etc/passwd
C:\Windows\
```

as storage locations.

The client may provide metadata.

The Server/Storage service generates the actual storage key.

Protection must cover:

* path traversal
* encoded traversal
* absolute paths
* null bytes
* path separator manipulation
* invalid Unicode/path normalization
* arbitrary destination paths

---

# 22. STORAGE KEY

Use logical opaque storage keys.

Example:

```text
originals/2026/09/<asset-id>.webp

processed/2026/09/<asset-id>.webp

frames/2026/09/<asset-id>.png

thumbnails/2026/09/<asset-id>.webp
```

Never expose physical filesystem paths as business data.

Do not store:

```text
/Users/user/omni/storage/...
```

in database records.

Prefer immutable IDs/keys that do not expose local machine information.

---

# 23. STORAGE VALIDATION

Every uploaded file must be validated for:

* size
* MIME type
* extension
* content signature where applicable
* filename safety
* storage category
* expected file type
* authorization

Do not trust browser-provided MIME type alone.

Where security requires it, inspect file signatures/magic bytes.

Client metadata is untrusted input.

---

# 24. STORAGE LIFECYCLE

Standard lifecycle:

```text
REQUEST
   ↓
AUTHORIZE
   ↓
UPLOAD
   ↓
VALIDATE
   ↓
TEMP
   ↓
VERIFY
   ↓
ORIGINAL / PROCESSED
   ↓
DELIVERY
   ↓
EXPIRATION
   ↓
DELETE
```

Temporary assets must have expiration rules.

Failed and abandoned uploads must not remain indefinitely.

---

# 25. STORAGE SERVICE INTERNAL STRUCTURE

Recommended:

```text
storage/src/

├── app/

├── modules/

│   ├── files/
│   ├── assets/
│   └── health/

├── plugins/

├── storage/

│   ├── service.ts
│   ├── provider.ts
│   ├── filesystem.ts
│   ├── path.ts
│   ├── validation.ts
│   └── cleanup.ts

├── security/

├── config/

└── index.ts
```

The filesystem implementation must remain behind the storage service boundary.

Application modules must not randomly use:

```text
fs.readFile()
fs.writeFile()
fs.unlink()
```

directly.

All physical storage operations go through the Storage Provider/Service boundary.

---

# 26. STORAGE PROVIDER

The initial implementation should use persistent filesystem storage.

Conceptually:

```text
Storage Service
      ↓
Storage Provider
      ↓
Filesystem Provider
      ↓
Persistent Filesystem
```

The Provider boundary exists to isolate physical storage implementation.

Do not build a large provider framework.

The abstraction should remain minimal until another storage implementation is genuinely required.

---

# 27. STORAGE REPLACEABILITY

The initial storage implementation uses persistent filesystem storage.

The architecture should allow future migration to:

```text
S3
R2
Object Storage
Other persistent storage
```

without forcing business modules to change.

Future changes should primarily affect:

```text
Storage Provider
Storage Service
Infrastructure Configuration
```

not business modules.

Do not introduce object storage before there is an actual requirement.

---

# 28. STORAGE VS CDN

`storage/` is not itself a traditional CDN.

The correct concept is:

```text
Storage Service
+
Controlled Media Delivery
+
CDN-like caching behavior
```

Possible future topology:

```text
Client
  ↓
CDN / Edge Cache
  ↓
Storage Service
  ↓
Persistent Storage
```

The storage service must remain usable without an external CDN.

Storage remains the origin authority.

---

# 29. CONTROLLED MEDIA DELIVERY

Storage may serve media directly.

Example:

```text
GET /cdn/:storageKey
```

Response may include:

```text
Content-Type
Content-Length
Cache-Control
ETag
Last-Modified
Content-Disposition
X-Content-Type-Options
```

For immutable assets, appropriate long-lived caching may be used.

For private assets, access must be authorized.

Private access may use:

```text
authenticated request
```

or:

```text
short-lived signed URL/token
```

when appropriate.

Do not make every stored file publicly accessible by default.

---

# 30. MEDIA DELIVERY SECURITY

Untrusted files must not automatically become executable browser content.

Consider safe behavior for:

```text
HTML
SVG
unknown binary
user-generated documents
```

Where appropriate:

* use safe `Content-Disposition`
* use correct MIME types
* use `X-Content-Type-Options: nosniff`
* apply restrictive response CSP where relevant
* prevent arbitrary inline execution
* prevent content-type confusion

Never assume a file is safe merely because its extension looks safe.

---

# 31. ATOMIC FILE OPERATIONS

Uploads must avoid exposing partially written files.

Preferred:

```text
temporary file
    ↓
write
    ↓
flush/verify
    ↓
atomic rename
    ↓
final storage key
```

A failed upload must not leave a valid-looking final asset.

---

# 32. DATABASE AND STORAGE

Server database stores business metadata.

Example:

```text
Asset

├── id
├── type
├── filename
├── mimeType
├── size
├── storageKey
├── checksum
├── status
├── createdAt
└── expiresAt
```

Physical binary files are owned by Storage.

Business metadata remains owned by Server.

Clean separation:

```text
Server
→ asset ownership
→ business metadata
→ business lifecycle

Storage
→ physical file
→ physical lifecycle
→ file integrity
→ media delivery
```

Storage should not duplicate business data unnecessarily.

---

# 33. STORAGE CONFIGURATION

Storage configuration must be centralized and validated.

Examples:

```text
STORAGE_ROOT
STORAGE_MAX_FILE_SIZE
STORAGE_TEMP_RETENTION
STORAGE_ALLOWED_MIME_TYPES
STORAGE_ALLOWED_EXTENSIONS
STORAGE_PUBLIC_BASE_URL
STORAGE_INTERNAL_AUTH
```

Do not hardcode physical production paths.

Do not read environment variables throughout random storage modules.

---

# 34. STORAGE PERSISTENCE

Production storage must be persistent.

Application deployment must not destroy media.

Preferred:

```text
Application
   ↓
STORAGE_ROOT
   ↓
Persistent Disk / Volume
```

The application must depend on configuration, not machine-specific filesystem assumptions.

Uploaded files must not live inside:

```text
dist/
build/
src/
```

---

# 35. STORAGE GIT POLICY

Generated files must never be committed.

If local development data is inside the repository:

```gitignore
storage/.data/
storage/data/
```

Production media must never be part of source control.

The repository contains storage architecture, not production user media.

---

# 36. STORAGE OBSERVABILITY

Storage operations must be observable.

Important events:

```text
upload
upload authorized
upload rejected
validation failure
storage failure
file retrieval
file retrieval failure
file deletion
file replacement
cleanup
expired asset
checksum mismatch
```

Logs should include:

```text
requestId
correlationId
service
operation
assetId
storageKey where safe
result
duration
```

Never log:

* authentication tokens
* secrets
* private credentials
* unnecessary sensitive file contents

---

# 37. SERVER ↔ STORAGE COMMUNICATION

Server communicates with Storage through a controlled service/API boundary.

Preferred:

```text
Server
  ↓
Storage Client
  ↓
Storage Fastify API
```

Do not make Server directly manipulate:

```text
storage/data/cdn/
```

filesystem paths.

This keeps ownership explicit.

---

# 38. STORAGE AUTHENTICATION

Storage API must not be publicly writable.

Internal endpoints must authenticate requests from trusted backend services.

Possible mechanisms:

```text
internal service token
signed internal request
mTLS
private network boundary
```

Use the simplest secure mechanism appropriate to deployment.

Do not invent service-mesh infrastructure without need.

---

# 39. STORAGE AUTHORIZATION

Storage must enforce operation-level authorization.

Examples:

```text
upload
read
delete
replace
stream
```

The Server remains responsible for business authorization.

Storage remains responsible for enforcing its service boundary and storage-level access rules.

---

# 40. STORAGE DIRECT ACCESS AUTHORIZATION

When Agent or Console communicates directly with Storage for large media:

```text
Client
  ↓
Server
  ↓
authorization
  ↓
upload/download session
  ↓
Storage
```

The direct Storage operation must remain scoped.

The client must not be able to transform an authorized upload into:

```text
arbitrary file write
arbitrary path write
arbitrary asset read
arbitrary asset delete
```

The Storage target must be bound to the authorized asset/session.

---

# 41. CORS

Production backend CORS must use an explicit allowlist.

Never use unrestricted:

```text
Access-Control-Allow-Origin: *
```

for authenticated/credentialed APIs.

Never use production:

```text
origin: true
```

as a shortcut.

Configuration:

```text
CORS_ALLOWED_ORIGINS
```

Development may explicitly allow:

```text
http://localhost:5173
http://localhost:5174
```

Production should contain only approved HTTPS origins.

Allowed methods and headers must be explicit.

Credential policy must be explicit.

CORS is not authentication.

Storage CORS must also be explicitly configured if browsers perform direct upload/download against Storage.

---

# 42. SECURITY HEADERS

Production HTTP responses must provide appropriate:

```text
Strict-Transport-Security
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
X-Frame-Options
```

CSP must include appropriate:

```text
frame-ancestors
```

for clickjacking protection.

Headers must be applied at the actual HTTP response boundary.

---

# 43. HSTS

Production HTTPS:

```text
Strict-Transport-Security:
max-age=31536000;
includeSubDomains
```

Do not enable HSTS for plain HTTP development.

Only use `preload` when intentionally meeting the requirements.

---

# 44. CSP

Production frontend applications must use a restrictive CSP.

Avoid:

```text
default-src *
script-src *
unsafe-eval
```

Avoid `unsafe-inline` for scripts unless genuinely required.

Baseline:

```text
default-src 'self';
base-uri 'self';
form-action 'self';
object-src 'none';
frame-ancestors 'none';
img-src 'self' data: blob:;
font-src 'self' data:;
style-src 'self' 'unsafe-inline';
script-src 'self';
connect-src 'self' https://<approved-api-domain> wss://<approved-websocket-domain>;
```

If Storage is a separate origin, explicitly allow it where required:

```text
img-src
media-src
connect-src
```

depending on actual application behavior.

Actual CSP must be adapted to the application.

Do not copy the baseline blindly.

---

# 45. VITE DEVELOPMENT VS PRODUCTION

Vite is a development server and build tool.

It is not the production security boundary.

Development may require:

```text
localhost
HMR
development WebSocket
development tooling
```

Production security must be enforced independently.

Do not weaken production security to make HMR work.

Production headers must be applied by the actual HTTP serving layer:

```text
HTTPS
CDN
Web Server
Fastify
Hosting Platform
```

as appropriate.

---

# 46. WEBSOCKET SECURITY

WebSocket communication:

```text
Server ↔ Agent
```

must validate:

* origin
* authentication
* authorization
* message type
* payload
* payload size
* heartbeat
* timeout
* duplicate messages
* disconnect state

CORS does not protect WebSocket.

---

# 47. WEBSOCKET PROTOCOL

Protocol baseline:

```json
{
  "id": "message-id",
  "type": "message.type",
  "timestamp": 0,
  "payload": {}
}
```

Protocol must define:

* message types
* payload schemas
* authentication
* authorization
* heartbeat
* reconnect
* timeout
* acknowledgement
* error behavior
* graceful disconnect
* duplicate protection
* message size limits

WebSocket lifecycle must remain outside UI components.

---

# 48. REQUEST SECURITY

Apply appropriate:

* HTTP method restrictions
* body size limits
* upload limits
* query limits
* WebSocket message limits
* rate controls where necessary
* authentication
* authorization
* validation

Do not introduce Redis solely for rate limiting.

Rate limiting should be introduced only when the actual deployment requires it.

---

# 49. AUTHENTICATION & AUTHORIZATION

Authentication:

```text
Who are you?
```

Authorization:

```text
What are you allowed to do?
```

These are separate concerns.

Every protected server operation must perform appropriate authorization.

Frontend permissions are UX only.

---

# 50. SECRETS MANAGEMENT

Never commit:

```text
passwords
API keys
private keys
JWT secrets
database credentials
session secrets
cloud credentials
internal service credentials
```

`VITE_*` values are public.

Never store secrets in `VITE_*`.

Production secrets must be injected through deployment configuration.

---

# 51. SECURITY LOGGING

Security events include:

```text
authentication failure
authorization failure
invalid token
blocked origin
invalid WebSocket connection
invalid payload
suspicious request
storage security failure
path traversal attempt
oversized upload
invalid file type
```

Do not log credentials.

---

# 52. DEPENDENCY SECURITY

Dependencies should be reviewed for:

* vulnerabilities
* unnecessary packages
* duplicate capabilities
* abandoned packages
* transitive risk

Use:

```bash
npm audit
```

where appropriate.

Maintain lockfiles.

Do not blindly upgrade major dependencies without compatibility review.

---

# 53. SECURITY HEADERS A+ TARGET

Production security headers have an explicit target:

```text
A+
```

Acceptance requires verifying the deployed HTTP response.

Verification must inspect:

* HSTS
* CSP
* CORS
* MIME protection
* Referrer Policy
* Permissions Policy
* clickjacking protection

Source configuration alone is not sufficient.

---

# 54. SECURITY ACCEPTANCE GATE

```text
[ ] Explicit CORS allowlist
[ ] No production wildcard CORS
[ ] Storage CORS explicitly controlled where required
[ ] WebSocket origin validation
[ ] Authentication boundary
[ ] Authorization boundary
[ ] Request validation
[ ] Request size limits
[ ] Upload size limits
[ ] WebSocket payload limits
[ ] Security headers
[ ] HSTS
[ ] CSP
[ ] X-Content-Type-Options
[ ] Referrer-Policy
[ ] Permissions-Policy
[ ] Clickjacking protection
[ ] No frontend secrets
[ ] No sensitive secrets in logs
[ ] Security events observable
[ ] Production security headers target A+
```

---

# 55. STATE MANAGEMENT

Use:

```text
Zustand
```

Stores must be separated by responsibility.

Examples:

```text
app.store.ts
auth.store.ts
connection.store.ts
settings.store.ts
```

Do not create giant global stores.

Do not globally store server data without reason.

---

# 56. SHARED FRONTEND DESIGN SYSTEM

Agent and Console use a project-owned design system.

References:

```text
shadcn/ui
Radix UI
```

Use them for:

* component architecture
* accessibility
* interaction
* visual language

Do not blindly install an entire UI framework.

---

# 57. COMPONENT HIERARCHY

```text
components/ui
      ↓
components/layout
      ↓
features
      ↓
pages/routes
```

Global primitives:

```text
Button
Input
Select
Checkbox
Switch
Dialog
Drawer
Dropdown
Tabs
Tooltip
Badge
Card
Table
Pagination
Alert
Toast
Skeleton
Loading
```

Layout:

```text
AppShell
Sidebar
Header
Content
MobileNavigation
```

Common:

```text
EmptyState
ErrorState
ConfirmDialog
PageHeader
```

No duplicate feature-specific primitives unless behavior genuinely differs.

---

# 58. COMPONENT API

Use consistent APIs:

```text
variant
size
state
disabled
loading
```

Button:

```text
default
secondary
destructive
outline
ghost
```

Sizes:

```text
sm
md
lg
```

Use `class-variance-authority` where useful.

---

# 59. FEATURE COMPONENTS

Feature components belong under:

```text
features/<feature>/components/
```

They may contain domain-specific composition.

They should reuse global UI primitives.

---

# 60. DESIGN TOKENS

Centralize:

```text
colors
typography
spacing
radius
shadows
borders
z-index
motion
breakpoints
```

Use CSS variables.

Themes:

```text
light
dark
system
```

---

# 61. RESPONSIVE DESIGN

Support:

```text
mobile
tablet
desktop
large desktop
```

Prefer:

```text
flex
grid
min/max
responsive spacing
fluid typography
fluid sizing
```

Avoid unnecessary fixed dimensions.

---

# 62. ACCESSIBILITY

Baseline:

```text
WCAG AA
```

Required:

* semantic HTML
* keyboard navigation
* visible focus
* ARIA
* labels
* descriptions
* logical tab order
* focus management
* Escape
* screen reader support
* form error association
* disabled semantics
* loading semantics
* sufficient contrast
* non-color-only status
* reduced motion
* touch targets

---

# 63. IMPORT & DEPENDENCY RULES

Prefer:

```text
@/components/ui/Button
```

Avoid excessive relative imports.

Avoid circular dependencies.

Lower-level shared components must not depend on feature-specific modules.

Dependency direction should remain predictable.

---

# 64. ENVIRONMENT CONFIGURATION

Supported:

```text
.env.dev
.env.prod
.env.example
```

Frontend:

```text
VITE_*
```

Only public configuration may enter frontend bundles.

Server configuration is centralized and Zod validated.

Storage configuration is centralized and Zod validated.

Examples:

```text
SERVER_PORT
DATABASE_URL
CORS_ALLOWED_ORIGINS

STORAGE_ROOT
STORAGE_MAX_FILE_SIZE
STORAGE_ALLOWED_MIME_TYPES
STORAGE_TEMP_RETENTION
STORAGE_PUBLIC_BASE_URL
```

Never place secrets in frontend environment variables.

---

# 65. TESTING

Required test categories:

```text
unit
integration
API
WebSocket protocol
component
store
service
Rust
storage
security
```

Storage tests should cover:

* upload
* validation
* retrieval
* streaming
* deletion
* replacement
* path safety
* MIME validation
* size limits
* expiration
* failure handling
* unauthorized access
* partial upload recovery
* atomic file behavior

Server/Storage integration should cover:

```text
authorize upload
create upload session
upload
finalize
persist metadata
retrieve
delete
expire
```

Critical business logic cannot depend only on manual testing.

---

# 66. CODE QUALITY

Required:

```text
TypeScript strict
ESLint
Prettier
typecheck
tests
```

Avoid:

```text
implicit any
unused imports
dead code
duplicated logic
duplicated UI
circular dependencies
giant modules
giant components
giant stores
```

Readable before clever.

---

# 67. DEVELOPMENT WORKFLOW

For every requirement:

## Step 1 — Understand

Determine:

```text
what
where
owner
existing capability
```

## Step 2 — Inspect

Inspect:

```text
components
services
repositories
stores
schemas
types
utilities
protocols
storage
architecture
```

## Step 3 — Reuse

Reuse existing capability.

## Step 4 — Extend

Extend an existing abstraction when responsibility belongs there.

## Step 5 — Create

Create new only when necessary.

## Step 6 — Validate

Run relevant:

```text
typecheck
lint
tests
build
```

## Step 7 — Review

Review:

```text
duplication
dependency direction
security
accessibility
maintainability
performance
observability
resource lifecycle
```

---

# 68. AI / ENGINEERING AGENT DECISION PRIORITY

When making decisions:

```text
1. Correctness
2. Security
3. Existing architecture
4. Simplicity
5. Reusability
6. Maintainability
7. Performance
8. Convenience
```

Convenience must never override security or architecture.

---

# 69. MULTIPLE SOLUTIONS

Prefer solutions with:

* fewer dependencies
* fewer abstractions
* more reuse
* clearer ownership
* fewer side effects
* easier testing
* easier removal
* preserved boundaries
* lower operational complexity

Do not select technology because it is fashionable.

---

# 70. PERFORMANCE

Performance decisions must be evidence-based.

Prefer:

* efficient queries
* controlled rendering
* lazy loading
* code splitting
* appropriate caching
* resource cleanup
* streaming where appropriate
* direct large-file data paths
* simple architecture

For media:

```text
Control Plane → Server
Data Plane    → Storage
```

Large binary assets should not unnecessarily pass through Server.

Do not introduce infrastructure for hypothetical scale.

---

# 71. BUILD & DEPLOYMENT

Production builds must be reproducible.

Server expected build:

```text
server/build/

├── dist/
│   ├── index.js
│   └── chunks/

├── drizzle/
│   ├── *.sql
│   └── meta/

├── package.json
├── package-lock.json
└── README.md
```

Expected:

```bash
cd server/build
npm ci --omit=dev
npm start
```

Production build must contain:

* compiled JavaScript
* required migrations
* production metadata
* lockfile

It must exclude:

* TypeScript source
* development dependencies
* unnecessary source maps
* development-only files

---

# 72. STORAGE DEPLOYMENT

Storage must be independently executable.

Expected logical build:

```text
storage/build/

├── dist/
├── package.json
├── package-lock.json
└── README.md
```

Expected:

```bash
cd storage/build
npm ci --omit=dev
npm start
```

Runtime data must NOT be bundled into the build.

Example:

```text
storage/build/
    ↓
STORAGE_ROOT
    ↓
persistent filesystem
```

Production uploaded files are deployment data, not application build artifacts.

---

# 73. SERVICE DEPLOYMENT MODEL

Logical services:

```text
┌───────────────┐
│     Agent     │
└───────┬───────┘
        │
        │ WSS / HTTPS
        ▼
┌───────────────┐
│    Server     │
│   Fastify     │
└───────┬───────┘
        │
        │ control / authorization
        ▼
┌───────────────┐
│    Storage    │
│   Fastify     │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Persistent FS │
└───────────────┘

┌───────────────┐
│    Console    │
└───────┬───────┘
        │
        │ HTTPS
        ▼
     Server
```

For large media:

```text
Agent / Console
       │
       │ direct authorized data transfer
       ▼
    Storage
```

The physical deployment may place Server and Storage on the same machine initially.

That does not remove their logical boundaries.

---

# 74. STORAGE / SERVER COLOCATION

Server and Storage may initially run on the same host.

Example:

```text
Host

├── server
├── storage
└── persistent storage
```

This is acceptable.

Logical separation remains mandatory even when physically colocated.

Do not introduce Docker or service orchestration merely to enforce logical separation.

---

# 75. HEALTH CHECKS

Every service must expose an appropriate health endpoint.

Server:

```text
GET /health
```

Storage:

```text
GET /health
```

Health checks should distinguish:

```text
process health
dependency health
storage availability
```

Do not perform expensive operations in basic liveness checks.

---

# 76. GRACEFUL SHUTDOWN

Fastify services must support graceful shutdown.

Shutdown should:

1. stop accepting new work
2. finish safe in-flight operations
3. close WebSocket connections appropriately
4. close database connections
5. close storage resources
6. flush required logs
7. exit cleanly

Storage must avoid deleting or corrupting files during shutdown.

---

# 77. API VERSIONING

Public APIs should be versioned when required.

Example:

```text
/api/v1/...
```

Internal service APIs may use:

```text
/internal/v1/...
```

Do not create versions unnecessarily.

Version when compatibility requires it.

---

# 78. CONTRACTS

Service boundaries must have explicit contracts.

Contracts should define:

* request
* response
* error
* authentication
* authorization
* validation
* version
* timeout expectations
* idempotency expectations
* size limits where applicable

Types and schemas should be derived from a clear source where practical.

---

# 79. TIMEOUTS & RETRIES

Internal service communication must define:

* connection timeout
* request timeout
* retry behavior
* retry limits
* failure behavior

Do not retry non-idempotent operations blindly.

Retries must not create duplicate business operations.

Storage upload sessions must have explicit expiration.

---

# 80. IDEMPOTENCY

Operations that may be retried must define idempotency where required.

Especially:

```text
uploads
asset creation
payment-related operations
job creation
print-related operations
```

Use explicit idempotency identifiers when necessary.

Storage uploads should support safe retry semantics without producing uncontrolled duplicate files.

---

# 81. RESOURCE CLEANUP

Every resource must have a lifecycle.

Examples:

```text
WebSocket
file handle
temporary file
database connection
timer
event listener
worker
stream
upload session
```

Resources must be released when no longer needed.

---

# 82. FILE UPLOAD SAFETY

File uploads must enforce:

```text
maximum size
allowed MIME types
allowed extensions
safe storage keys
path traversal protection
temporary lifecycle
authorization
content validation
```

Never execute uploaded content.

Never treat a filename as trusted.

Never allow arbitrary destination paths.

---

# 83. API RESPONSE RULES

Responses must be predictable.

Avoid random response structures.

Use the established success/error model unless a protocol explicitly requires a different format.

Do not leak internal implementation details through error messages.

---

# 84. FRONTEND SECURITY

Frontend security includes:

* restrictive CSP in production
* safe DOM usage
* no arbitrary HTML injection
* no secrets
* safe external resource policy
* secure authentication handling
* safe WebSocket usage
* controlled external navigation

Never use dangerous browser APIs without a justified reason.

---

# 85. PRODUCTION CONFIGURATION

Production configuration must be:

```text
explicit
validated
minimal
secret-safe
environment-specific
```

Development configuration must not accidentally become production configuration.

---

# 86. PRODUCTION READINESS

Before production:

```text
Architecture
Security
Testing
Observability
Deployment
Persistence
Recovery
```

must all be reviewed.

A successful local build does not mean production readiness.

---

# 87. BACKUP & RECOVERY

Persistent data must have a recovery strategy.

At minimum identify:

```text
database backup
storage backup
retention
restore procedure
```

Storage and database must be considered separately.

A database backup alone does not guarantee media recovery.

The recovery plan must consider metadata/file consistency.

---

# 88. DATA RETENTION

Every temporary or expiring asset should have an explicit retention policy.

Examples:

```text
temp
uploads
generated previews
expired sessions
```

Retention must be enforceable by backend/storage cleanup processes.

---

# 89. NO UNCONTROLLED DATA GROWTH

Do not allow:

```text
temporary files
failed uploads
old generated assets
unused thumbnails
expired sessions
```

to grow indefinitely.

Every persistent asset category must have a lifecycle.

Cleanup must be observable and failure-tolerant.

---

# 90. QUALITY GATE

Every meaningful implementation should pass the applicable:

```text
typecheck
lint
unit tests
integration tests
build
security review
accessibility review
architecture review
```

Not every tiny change requires every expensive check, but the final feature implementation must be verified appropriately.

---

# 91. IMPLEMENTATION PHASES

## Phase 1 — Foundation

Establish:

* repository structure
* Node 24
* npm
* TypeScript
* package configuration
* ESLint
* Prettier
* aliases
* environment foundation

Repository must establish:

```text
agent/
console/
storage/
server/
```

---

## Phase 2 — Server Foundation

Establish:

* Fastify
* configuration
* validation
* errors
* logging
* PostgreSQL
* Drizzle
* migrations
* REST foundation
* WebSocket foundation
* security foundation
* authentication foundation
* authorization foundation

---

## Phase 3 — Storage Foundation

Establish:

* Fastify Storage service
* Storage API
* filesystem provider
* storage validation
* path safety
* upload sessions
* upload limits
* direct media transfer
* download/streaming
* asset delivery
* cleanup
* storage security
* persistent storage configuration
* observability

---

## Phase 4 — Design System

Establish:

* design tokens
* themes
* UI primitives
* layout primitives
* accessibility
* responsive foundation

---

## Phase 5 — Console Foundation

Establish:

* React
* Vite
* routing
* Zustand
* API client
* application shell
* reusable admin components
* authorized media access

---

## Phase 6 — Agent Foundation

Establish:

* React
* Vite
* Zustand
* application services
* WebSocket client
* Tauri
* Rust
* IPC
* authorized media upload/download
* local print/device integration

---

## Phase 7 — Quality & Security Audit

Verify:

* architecture
* dependency direction
* type safety
* lint
* tests
* accessibility
* CORS
* CSP
* security headers
* WebSocket security
* storage security
* direct media transfer
* upload authorization
* secret exposure
* logging
* observability
* cleanup

---

## Phase 8 — Production Build

Verify:

* production builds
* migrations
* storage persistence
* deployment artifacts
* standalone execution
* HTTPS
* security headers
* A+ target
* backups
* recovery
* storage recovery
* database/storage consistency

---

# 92. ACCEPTANCE GATE

The architectural foundation is complete only when applicable requirements are satisfied:

```text
[ ] Node 24 enforced

[ ] Root repository boundaries established
[ ] Agent boundary established
[ ] Console boundary established
[ ] Server boundary established
[ ] Storage boundary established

[ ] Server follows Route → Service → Repository → Database
[ ] Agent follows React → Tauri IPC → Rust → OS
[ ] Console uses HTTP/REST
[ ] Server ↔ Agent WebSocket exists
[ ] Server ↔ Storage API exists

[ ] Storage is a first-class Fastify service
[ ] Storage Provider boundary exists
[ ] Persistent storage works
[ ] Storage lifecycle exists
[ ] Storage upload works
[ ] Storage download/stream works
[ ] Storage deletion works
[ ] Storage cleanup works

[ ] Large media can bypass Server data proxying
[ ] Server remains authorization/control authority
[ ] Direct Storage upload is scoped
[ ] Direct Storage download is scoped
[ ] Upload sessions expire
[ ] Storage does not expose filesystem paths

[ ] PostgreSQL + Drizzle works
[ ] Zod validation exists
[ ] Centralized error handling exists
[ ] Structured logging exists
[ ] Request IDs exist
[ ] Correlation IDs exist
[ ] Service correlation exists

[ ] Design system exists
[ ] Accessibility baseline exists
[ ] Responsive foundation exists
[ ] Theme foundation exists
[ ] Zustand architecture exists

[ ] TypeScript strict mode enabled
[ ] ESLint enabled
[ ] Prettier enabled
[ ] Tests executable

[ ] No obvious circular dependencies
[ ] No duplicated global UI primitives

[ ] CORS uses explicit production allowlist
[ ] Storage CORS is explicitly controlled where required
[ ] WebSocket origin validation exists
[ ] Authentication boundary exists
[ ] Authorization boundary exists
[ ] Request limits exist
[ ] Upload limits exist

[ ] Path traversal protection exists
[ ] MIME/content validation exists
[ ] Atomic file handling exists
[ ] Temporary file cleanup exists
[ ] Untrusted file handling is hardened

[ ] Security headers exist
[ ] CSP exists
[ ] HSTS exists in production
[ ] Clickjacking protection exists
[ ] X-Content-Type-Options exists
[ ] Referrer-Policy exists
[ ] Permissions-Policy exists

[ ] No secrets in frontend bundles
[ ] No secrets in logs
[ ] Storage is not committed to Git
[ ] Production storage is persistent
[ ] Storage cleanup exists

[ ] Production server build is independently executable
[ ] Production storage service is independently executable

[ ] Production security-header target is A+
[ ] Backup/recovery strategy exists
[ ] Database recovery strategy exists
[ ] Storage recovery strategy exists
```

---

# 93. FINAL ENGINEERING RULE

Before writing code, always ask:

```text
Does this already exist?

Where does this responsibility belong?

Who owns this responsibility?

Can the existing architecture solve it?

Can this be simpler?

Am I creating duplication?

Am I breaking a boundary?

Does this introduce unnecessary dependency?

Does this introduce unnecessary infrastructure?

Is it testable?

Is it accessible?

Is it secure?

Is it observable?

Is the lifecycle clear?

Can it be removed later?

Does this unnecessarily proxy large data?

Can the control plane and data plane be separated?
```

If existing architecture is sufficient:

```text
REUSE
```

If existing architecture is almost sufficient:

```text
EXTEND
```

If existing architecture is genuinely insufficient:

```text
CHANGE DELIBERATELY
```

Architectural changes must follow:

```text
IDENTIFY
   ↓
JUSTIFY
   ↓
DESIGN
   ↓
DOCUMENT
   ↓
IMPLEMENT
   ↓
VERIFY
```

Never introduce architecture silently.

---

# 94. OMNI ENGINEERING OBJECTIVE

Every implementation must move Omni toward:

```text
CLEAN
MODULAR
REUSABLE
TYPE-SAFE
ACCESSIBLE
SECURE
OBSERVABLE
MAINTAINABLE
SCALABLE
```

while preserving:

```text
MINIMUM NECESSARY COMPLEXITY
```

The best architecture is not the architecture with the most technologies.

It is the architecture where:

```text
every responsibility has a clear owner

every boundary has a reason

every dependency has a purpose

every security control is explicit

every abstraction earns its existence

every feature can be tested

every resource has a lifecycle

every service can be observed

every change can be understood

large data does not unnecessarily pass through unrelated services
```

---

# 95. MASTER RULE FOR ALL FUTURE PLANS

Every future feature specification or proposal must align with the core architecture:

```text
WHAT IS NEW
WHAT CHANGES
WHAT IS BEING IMPLEMENTED
HOW IT FITS THE ARCHITECTURE
HOW IT WILL BE VERIFIED
```

It must NOT repeat the entire specification.

If a future requirement needs to alter an architectural standard, it must explicitly state:

```text
CONFLICT

REASON

IMPACT

PROPOSED CHANGE

MIGRATION

VERIFICATION
```

Only then may the architecture specification itself be revised.

---

# 96. OMNI MASTER DATA FLOW

The canonical Omni architecture is:

```text
                         ┌───────────────┐
                         │    Console    │
                         └───────┬───────┘
                                 │
                              HTTPS
                                 │
                                 ▼
┌───────────────┐          ┌───────────────┐
│     Agent     │          │    Server     │
│               │◄────────►│    Fastify    │
│ React         │   WSS    │               │
│ Tauri         │          │ Auth          │
│ Rust          │          │ Business      │
│ Print         │          │ PostgreSQL    │
└───────┬───────┘          └───────┬───────┘
        │                          │
        │                          │ authorization /
        │                          │ control
        │                          ▼
        │                   ┌───────────────┐
        │                   │    Storage    │
        └──────────────────►│    Fastify    │
          direct media      │               │
          transfer          │ File Service  │
                            └───────┬───────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │ Persistent FS │
                            └───────────────┘
```

The critical architectural rule is:

```text
SERVER = CONTROL / BUSINESS PLANE

STORAGE = BINARY DATA / MEDIA PLANE

AGENT / CONSOLE = CLIENTS

POSTGRESQL = BUSINESS DATA

FILESYSTEM = PHYSICAL MEDIA
```

The Server controls **what is allowed**.

The Storage service controls **how binary data is stored and delivered**.

The Client transfers large binary data **directly to/from Storage when appropriate**.

This prevents unnecessary:

```text
Client → Server → Storage
```

binary proxying.

# 50. AGENT DESKTOP CI/CD & BUILD PIPELINE SPECIFICATION

The Agent desktop application (`agent/`) uses GitHub Actions for automated cross-platform desktop installer generation (Tauri 2 + Rust).

## 50.1 Workflow Configuration

The build workflow is defined in [.github/workflows/build-tauri.yml](file:///Users/muhammadimamrozali/RND/omni/.github/workflows/build-tauri.yml).

Triggers:
* `release` event (`published`)
* `push` to `release` branch
* `push` to tag pattern `v*`
* `workflow_dispatch` (manual execution)

## 50.2 Runtime & Compiler Environment

* Node.js: `24` (`actions/setup-node@v4`)
* Rust Toolchain: `stable` (`dtolnay/rust-toolchain@stable`)

## 50.3 Platform Targets & Artifacts

1. **Windows (`build-windows`)**:
   * Environment: `windows-latest`
   * Build command: `npm --prefix agent run tauri:build`
   * Artifacts: `.exe` (NSIS installer) and `.msi` (MSI installer)
   * Target path: `agent/src-tauri/target/release/bundle/nsis/*.exe`, `agent/src-tauri/target/release/bundle/msi/*.msi`

2. **macOS (`build-macos`)**:
   * Environment: `macos-latest`
   * Build command: `npm --prefix agent run tauri:build`
   * Artifacts: `.dmg` (Apple disk image installer)
   * Target path: `agent/src-tauri/target/release/bundle/dmg/*.dmg`

## 50.4 Version Synchronization

When triggered by a release tag (`vX.Y.Z`), the pipeline automatically synchronizes version strings across:
* `agent/package.json`
* `agent/src-tauri/tauri.conf.json`
* `agent/src-tauri/Cargo.toml`

---

# FINAL STATEMENT

This specification defines the core architecture and engineering standards for the Omni platform.

It is the primary engineering reference and source of truth for the repository.

All team members, developers, feature implementations, and architectural changes should follow it.

The purpose is not maximum abstraction.

The purpose is not maximum infrastructure.

The purpose is:

```text
CORRECT

SIMPLE

SECURE

MODULAR

REUSABLE

MAINTAINABLE

OBSERVABLE

SCALABLE
```

with the **minimum necessary complexity**.

The canonical Omni principle is:

> **Server decides. Storage stores. Client operates. Database records business state. Every boundary has a clear owner. Large binary data should use the shortest safe path.**
