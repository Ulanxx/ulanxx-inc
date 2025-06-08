## nestjs 实现多 Agent 交互系统

### 1. 系统架构设计

使用 NestJS 的模块化架构，我们可以构建一个灵活且可扩展的多 agent 系统：

```typescript
// src/app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot(),
    AgentModule,
    WorkflowModule,
    CommunicationModule,
    MonitoringModule,
  ],
})
export class AppModule {}
```

#### 4.2 Agent 模块设计

```typescript
// src/agent/agent.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Agent])],
  providers: [AgentService, AgentFactory],
  exports: [AgentService],
})
export class AgentModule {}

// src/agent/agent.entity.ts
@Entity()
export class Agent {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column("json")
  capabilities: string[];

  @Column("json")
  configuration: Record<string, any>;

  @Column()
  status: AgentStatus;

  @Column("json")
  metrics: AgentMetrics;
}

// src/agent/agent.service.ts
@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    private agentFactory: AgentFactory
  ) {}

  async createAgent(config: AgentConfig): Promise<Agent> {
    const agent = this.agentFactory.createAgent(config);
    return this.agentRepository.save(agent);
  }

  async getAgentById(id: string): Promise<Agent> {
    return this.agentRepository.findOneOrFail({ where: { id } });
  }

  async updateAgentStatus(id: string, status: AgentStatus): Promise<void> {
    await this.agentRepository.update(id, { status });
  }
}
```

### 3. 工作流配置系统

```typescript
// src/workflow/workflow.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Workflow])],
  providers: [WorkflowService, WorkflowEngine],
  exports: [WorkflowService, WorkflowEngine],
})
export class WorkflowModule {}

// src/workflow/workflow.entity.ts
@Entity()
export class Workflow {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("json")
  definition: WorkflowDefinition;

  @Column()
  status: WorkflowStatus;

  @Column("json")
  variables: Record<string, any>;
}

// src/workflow/workflow.engine.ts
@Injectable()
export class WorkflowEngine {
  constructor(
    private agentService: AgentService,
    private eventEmitter: EventEmitter2
  ) {}

  async executeWorkflow(workflowId: string, input: any): Promise<any> {
    const workflow = await this.workflowService.getWorkflow(workflowId);
    const context = new WorkflowContext(workflow, input);

    for (const step of workflow.definition.steps) {
      await this.executeStep(step, context);
    }

    return context.getOutput();
  }

  private async executeStep(step: WorkflowStep, context: WorkflowContext) {
    const agent = await this.agentService.getAgentById(step.agentId);
    const result = await agent.execute(step.action, context.getVariables());
    context.setStepResult(step.id, result);
  }
}
```

### 4. Agent 通信系统

```typescript
// src/communication/communication.module.ts
@Module({
  imports: [RedisModule],
  providers: [MessageBroker, CommunicationService],
  exports: [CommunicationService],
})
export class CommunicationModule {}

// src/communication/message-broker.ts
@Injectable()
export class MessageBroker {
  constructor(
    private readonly redis: Redis,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async publish(channel: string, message: any): Promise<void> {
    await this.redis.publish(channel, JSON.stringify(message));
  }

  async subscribe(
    channel: string,
    callback: (message: any) => void
  ): Promise<void> {
    const subscriber = this.redis.duplicate();
    await subscriber.subscribe(channel);
    subscriber.on("message", (_, message) => {
      callback(JSON.parse(message));
    });
  }
}

// src/communication/communication.service.ts
@Injectable()
export class CommunicationService {
  constructor(private messageBroker: MessageBroker) {}

  async sendMessage(from: string, to: string, message: any): Promise<void> {
    await this.messageBroker.publish(`agent:${to}`, {
      from,
      to,
      content: message,
      timestamp: new Date(),
    });
  }

  async broadcast(message: any, exclude?: string[]): Promise<void> {
    await this.messageBroker.publish("broadcast", {
      content: message,
      exclude,
      timestamp: new Date(),
    });
  }
}
```

### 5. 可配置的工作流定义

```typescript
// src/workflow/interfaces/workflow.interface.ts
interface WorkflowDefinition {
  version: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  variables: WorkflowVariable[];
  errorHandling: ErrorHandlingStrategy;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: "agent" | "condition" | "loop" | "parallel";
  agentId?: string;
  action: string;
  input: Record<string, any>;
  next?: string;
  errorNext?: string;
  timeout?: number;
}

// src/workflow/workflow.service.ts
@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow)
    private workflowRepository: Repository<Workflow>,
    private workflowEngine: WorkflowEngine
  ) {}

  async createWorkflow(definition: WorkflowDefinition): Promise<Workflow> {
    const workflow = new Workflow();
    workflow.name = definition.name;
    workflow.definition = definition;
    workflow.status = WorkflowStatus.ACTIVE;
    return this.workflowRepository.save(workflow);
  }

  async executeWorkflow(workflowId: string, input: any): Promise<any> {
    return this.workflowEngine.executeWorkflow(workflowId, input);
  }
}
```

### 6. 示例：代码审查工作流

```typescript
// src/workflows/code-review.workflow.ts
const codeReviewWorkflow: WorkflowDefinition = {
  version: "1.0",
  name: "Code Review Workflow",
  description: "Automated code review process",
  steps: [
    {
      id: "security-check",
      name: "Security Analysis",
      type: "agent",
      agentId: "security-agent",
      action: "analyze",
      input: {
        type: "security",
        rules: ["owasp", "cwe"],
      },
      next: "style-check",
    },
    {
      id: "style-check",
      name: "Code Style Check",
      type: "agent",
      agentId: "style-agent",
      action: "check",
      input: {
        rules: ["eslint", "prettier"],
      },
      next: "performance-check",
    },
    {
      id: "performance-check",
      name: "Performance Analysis",
      type: "agent",
      agentId: "performance-agent",
      action: "analyze",
      input: {
        metrics: ["complexity", "memory", "cpu"],
      },
      next: "aggregate-results",
    },
    {
      id: "aggregate-results",
      name: "Aggregate Results",
      type: "agent",
      agentId: "report-agent",
      action: "generate-report",
      input: {
        format: "markdown",
      },
    },
  ],
  variables: [
    {
      name: "repository",
      type: "string",
      required: true,
    },
    {
      name: "branch",
      type: "string",
      required: true,
    },
  ],
  errorHandling: {
    strategy: "retry",
    maxRetries: 3,
    retryDelay: 5000,
  },
};
```

### 7. 监控和日志系统

```typescript
// src/monitoring/monitoring.module.ts
@Module({
  imports: [PrometheusModule],
  providers: [MonitoringService, MetricsCollector],
  exports: [MonitoringService],
})
export class MonitoringModule {}

// src/monitoring/monitoring.service.ts
@Injectable()
export class MonitoringService {
  constructor(
    private metricsCollector: MetricsCollector,
    private logger: Logger
  ) {}

  @Metric("agent_execution_time")
  async recordAgentExecution(agentId: string, duration: number): Promise<void> {
    this.metricsCollector.recordExecutionTime(agentId, duration);
    this.logger.debug(`Agent ${agentId} execution time: ${duration}ms`);
  }

  @Metric("workflow_completion")
  async recordWorkflowCompletion(
    workflowId: string,
    status: string
  ): Promise<void> {
    this.metricsCollector.recordWorkflowStatus(workflowId, status);
    this.logger.info(`Workflow ${workflowId} completed with status: ${status}`);
  }
}
```

### 8. 配置管理

```typescript
// src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  agents: {
    defaultTimeout: 30000,
    maxRetries: 3,
    retryDelay: 1000,
  },
  workflows: {
    maxConcurrent: 10,
    defaultTimeout: 300000,
  },
});
```

### 9. 使用示例

```typescript
// src/example/usage.ts
@Controller("workflows")
export class WorkflowController {
  constructor(
    private workflowService: WorkflowService,
    private monitoringService: MonitoringService
  ) {}

  @Post("execute")
  async executeWorkflow(
    @Body() input: { workflowId: string; data: any }
  ): Promise<any> {
    const startTime = Date.now();
    try {
      const result = await this.workflowService.executeWorkflow(
        input.workflowId,
        input.data
      );

      await this.monitoringService.recordWorkflowCompletion(
        input.workflowId,
        "success"
      );

      return result;
    } catch (error) {
      await this.monitoringService.recordWorkflowCompletion(
        input.workflowId,
        "failed"
      );
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      await this.monitoringService.recordWorkflowDuration(
        input.workflowId,
        duration
      );
    }
  }
}
```

### 10. 部署和扩展

使用 Docker Compose 进行部署：

```yaml
# docker-compose.yml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:13
    environment:
      - POSTGRES_PASSWORD=secret
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6
    volumes:
      - redis_data:/data

  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    depends_on:
      - prometheus

volumes:
  postgres_data:
  redis_data:
```

这个基于 NestJS 的实现提供了以下优势：

1. **模块化架构**：使用 NestJS 的模块系统实现清晰的代码组织
2. **类型安全**：利用 TypeScript 提供完整的类型检查
3. **可扩展性**：易于添加新的 agent 类型和工作流
4. **可配置性**：通过配置文件和工作流定义实现灵活的系统配置
5. **监控和可观测性**：集成了完整的监控和日志系统
6. **高性能**：使用 Redis 实现高效的 agent 间通信
7. **可靠性**：包含错误处理和重试机制
8. **可维护性**：遵循 SOLID 原则和最佳实践
