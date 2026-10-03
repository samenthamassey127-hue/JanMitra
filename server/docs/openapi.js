export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "JanMitra (जनमित्र) Civic Intelligence API",
    description: "Production API for welfare discovery, document verification, statutory tracking, and community civic notices across Uttar Pradesh.",
    version: "2.1.0",
    contact: {
      name: "Samentha Massey (@samentha)",
      url: "https://vakh.com/samentha"
    }
  },
  servers: [
    { url: "/api", description: "Current JanMitra Host" },
    { url: "http://localhost:5000/api", description: "Local Development Server" }
  ],
  paths: {
    "/health": {
      get: {
        summary: "Check backend and database health",
        responses: {
          200: { description: "Health status and active persistence mode" }
        }
      }
    },
    "/auth/register": {
      post: {
        summary: "Register new citizen or officer account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                  full_name: { type: "string" },
                  phone: { type: "string" },
                  role: { type: "string", enum: ["citizen", "csc_operator", "gram_pradhan", "officer"] },
                  district: { type: "string" }
                },
                required: ["email", "password", "full_name"]
              }
            }
          }
        },
        responses: { 201: { description: "User registered with JWT" } }
      }
    },
    "/auth/login": {
      post: {
        summary: "Authenticate citizen or officer",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" }
                },
                required: ["email", "password"]
              }
            }
          }
        },
        responses: { 200: { description: "JWT access token returned" } }
      }
    },
    "/auth/me": {
      get: {
        summary: "Retrieve authenticated citizen profile",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "User profile" } }
      }
    },
    "/analyze-situation": {
      post: {
        summary: "Extract demographic attributes and uncertainty metrics from natural language",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  query: { type: "string", example: "I am a 20 year old student from Lucknow OBC family income 1.5 lakh" },
                  language: { type: "string", default: "en" }
                },
                required: ["query"]
              }
            }
          }
        },
        responses: { 200: { description: "Extracted profile with confidence score and uncertainty flags" } }
      }
    },
    "/simplify-legal": {
      post: {
        summary: "Transform complex government gazette order into plain language ('Explain Like I am 10')",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { text: { type: "string" } },
                required: ["text"]
              }
            }
          }
        },
        responses: { 200: { description: "Simplified statutory card with action steps and cautions" } }
      }
    },
    "/ocr/scan": {
      post: {
        summary: "Upload and analyze government document (Aadhaar, Income, Domicile, Land Record)",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: { type: "string", format: "binary" },
                  docHint: { type: "string" }
                }
              }
            },
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  base64Image: { type: "string" },
                  docHint: { type: "string" }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Extracted fields, document classification, validity status" } }
      }
    },
    "/schemes": {
      get: {
        summary: "List all verified government welfare schemes",
        parameters: [
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } }
        ],
        responses: { 200: { description: "List of schemes" } }
      }
    },
    "/schemes/{id}/versions": {
      get: {
        summary: "Retrieve official gazette audit versions and change history for a scheme",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Gazette revision history" } }
      }
    },
    "/services": {
      get: {
        summary: "List UP Janhit Guarantee Act statutory services and SLAs",
        responses: { 200: { description: "List of services with SLA days" } }
      }
    },
    "/vakh/notices": {
      get: {
        summary: "Retrieve real-time Vakh community notices and camp alerts",
        parameters: [{ name: "district", in: "query", schema: { type: "string" } }],
        responses: { 200: { description: "Notices list" } }
      },
      post: {
        summary: "Broadcast a new ground reality notice",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  district: { type: "string" },
                  content: { type: "string" },
                  author: { type: "string" },
                  category: { type: "string" }
                },
                required: ["district", "content"]
              }
            }
          }
        },
        responses: { 201: { description: "Notice published" } }
      }
    },
    "/journeys": {
      get: {
        summary: "Get persistent application journeys for current user or district",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "Journeys array" } }
      },
      post: {
        summary: "Save or create an application journey",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } }
        },
        responses: { 201: { description: "Journey stored" } }
      }
    },
    "/journeys/{id}/stage": {
      patch: {
        summary: "Transition an application through statutory stages",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  stage: { type: "string" },
                  notes: { type: "string" }
                },
                required: ["stage"]
              }
            }
          }
        },
        responses: { 200: { description: "Stage updated" } }
      }
    },
    "/track/{applicationNumber}": {
      get: {
        summary: "Track application progress with statutory SLA timeline",
        parameters: [{ name: "applicationNumber", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Verified status timeline" } }
      }
    },
    "/government/edistrict/verify": {
      post: {
        summary: "UP e-District sandbox certificate validation",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  certType: { type: "string" },
                  certNumber: { type: "string" }
                },
                required: ["certNumber"]
              }
            }
          }
        },
        responses: { 200: { description: "Verification outcome" } }
      }
    },
    "/government/dbt/check-seeding": {
      post: {
        summary: "NPCI / PFMS Aadhaar bank account seeding check",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { aadhaarLast4: { type: "string" } },
                required: ["aadhaarLast4"]
              }
            }
          }
        },
        responses: { 200: { description: "Aadhaar DBT linkage status" } }
      }
    }
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

export function renderDocsHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JanMitra (जनमित्र) - API Documentation & Sandbox</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css">
  <style>
    body { margin: 0; background: #0f172a; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .header-banner { background: linear-gradient(135deg, #1e3a8a 0%, #047857 100%); padding: 24px; text-align: center; border-bottom: 2px solid #38bdf8; }
    .header-banner h1 { margin: 0 0 6px 0; font-size: 26px; }
    .header-banner p { margin: 0; color: #e2e8f0; font-size: 14px; }
    .swagger-ui { background: #fff; padding: 20px; border-radius: 8px; margin: 20px auto; max-width: 1200px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
  </style>
</head>
<body>
  <div class="header-banner">
    <h1>🏛️ JanMitra (जनमित्र) Unified API Portal</h1>
    <p>Statutory Welfare Engine & Government Service Sandbox | Curated by Samentha Massey (@samentha on Vakh)</p>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: '/api/openapi.json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis],
        layout: "BaseLayout",
        deepLinking: true
      });
    };
  </script>
</body>
</html>`;
}
