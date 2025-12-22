import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler } from "@nestjs/common"
import type { Observable } from "rxjs"
import { tap } from "rxjs/operators"

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, url, user, body } = request
    const now = Date.now()

    return next.handle().pipe(
      tap({
        next: (response) => {
          const responseTime = Date.now() - now
          console.log(`[v0] Audit Log: ${method} ${url} - ${responseTime}ms`, {
            user: user?.email,
            body: JSON.stringify(body),
            response: response?.statusCode || 200,
          })
        },
        error: (error) => {
          const responseTime = Date.now() - now
          console.error(`[v0] Audit Error: ${method} ${url} - ${responseTime}ms`, {
            user: user?.email,
            error: error.message,
          })
        },
      }),
    )
  }
}
