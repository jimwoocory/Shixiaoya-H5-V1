const express = require('express');
const swaggerUi = require('swagger-ui-express');
const router = express.Router();

// Swagger API文档配置
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: '施小雅板材系统 API',
    version: '1.0.0',
    description: '施小雅板材多端应用后端API接口文档',
    contact: {
      name: '施小雅板材',
      email: 'admin@shixiaoya.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: '开发环境'
    }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['系统'],
        summary: '健康检查',
        responses: {
          200: {
            description: '系统正常',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'OK' },
                    timestamp: { type: 'string', example: '2025-08-24T05:24:00.000Z' },
                    uptime: { type: 'number', example: 123.456 }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/products': {
      get: {
        tags: ['产品管理'],
        summary: '获取产品列表',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: '页码',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            description: '每页数量',
            schema: { type: 'integer', default: 10 }
          },
          {
            name: 'categoryId',
            in: 'query',
            description: '分类ID',
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: {
            description: '成功获取产品列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        products: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'integer', example: 1 },
                              name: { type: 'string', example: '超E0级实木颗粒板' },
                              description: { type: 'string', example: '环保等级达到超E0标准的实木颗粒板' },
                              price: { type: 'number', example: 158.00 },
                              priceUnit: { type: 'string', example: '张' },
                              rating: { type: 'number', example: 4.8 },
                              isHot: { type: 'boolean', example: true },
                              isNew: { type: 'boolean', example: false }
                            }
                          }
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            page: { type: 'integer', example: 1 },
                            limit: { type: 'integer', example: 10 },
                            total: { type: 'integer', example: 3 },
                            pages: { type: 'integer', example: 1 }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/categories': {
      get: {
        tags: ['分类管理'],
        summary: '获取分类列表',
        responses: {
          200: {
            description: '成功获取分类列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 1 },
                          name: { type: 'string', example: '实木板材' },
                          description: { type: 'string', example: '天然实木制作的板材' },
                          level: { type: 'integer', example: 1 },
                          sortOrder: { type: 'integer', example: 1 }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/applications': {
      get: {
        tags: ['应用场景'],
        summary: '获取应用场景列表',
        responses: {
          200: {
            description: '成功获取应用场景列表'
          }
        }
      }
    },
    '/api/inquiries': {
      post: {
        tags: ['询价管理'],
        summary: '提交询价',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['contactName', 'contactPhone', 'requirements'],
                properties: {
                  contactName: { type: 'string', example: '张先生' },
                  contactPhone: { type: 'string', example: '13800138000' },
                  contactEmail: { type: 'string', example: 'zhang@example.com' },
                  companyName: { type: 'string', example: '某装修公司' },
                  requirements: { type: 'string', example: '需要100张实木板材' },
                  quantity: { type: 'integer', example: 100 },
                  budget: { type: 'number', example: 15000.00 },
                  urgency: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], example: 'medium' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: '询价提交成功'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: '错误信息' },
          error: { type: 'string', example: '详细错误描述' }
        }
      }
    }
  }
};

// 设置Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: '施小雅板材系统 API 文档'
}));

module.exports = router;