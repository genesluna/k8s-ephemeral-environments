import { describe, it, expect, beforeEach } from 'vitest';
import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(() => {
    service = new MetricsService();
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return prometheus format metrics', async () => {
    const metrics = await service.getMetrics();

    expect(metrics).toContain('# HELP');
    expect(metrics).toContain('# TYPE');
  });

  it('should return correct content type', () => {
    const contentType = service.getContentType();

    expect(contentType).toContain('text/plain');
  });

  it('should register http request duration metric', async () => {
    const metrics = await service.getMetrics();

    expect(metrics).toContain('http_request_duration_seconds');
  });

  it('should register http request total metric', async () => {
    const metrics = await service.getMetrics();

    expect(metrics).toContain('http_requests_total');
  });

  it('should register database pool metrics', async () => {
    const metrics = await service.getMetrics();

    expect(metrics).toContain('db_pool_connections_total');
    expect(metrics).toContain('db_pool_connections_idle');
    expect(metrics).toContain('db_pool_connections_waiting');
  });

  it('should register database query duration metric', async () => {
    const metrics = await service.getMetrics();

    expect(metrics).toContain('db_query_duration_seconds');
  });

  it('should track http request duration', async () => {
    const labels = { method: 'GET', route: '/api/test', status_code: '200' };
    service.httpRequestDuration.observe(labels, 0.5);

    const metrics = await service.getMetrics();

    expect(metrics).toContain('http_request_duration_seconds_bucket');
  });

  it('should track http request count', async () => {
    const labels = { method: 'GET', route: '/api/test', status_code: '200' };
    service.httpRequestTotal.inc(labels);

    const metrics = await service.getMetrics();

    expect(metrics).toContain('http_requests_total');
  });

  it('should include default Node.js metrics', async () => {
    const metrics = await service.getMetrics();

    // Node.js process metrics are collected by default
    expect(metrics).toContain('process_');
  });

  it('should include default labels', async () => {
    const metrics = await service.getMetrics();

    expect(metrics).toContain('app="demo-app"');
  });
});
