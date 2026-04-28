export interface IAutomationAction<TPayload = Record<string, unknown>> {
  execute(payload: TPayload): Promise<void>;
}
