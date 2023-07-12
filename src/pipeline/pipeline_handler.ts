/*
   Copyright 2022 Nikita Petko <petko@vmminfra.net>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/*
	File Name: pipeline_handler.ts
	Description: A class that represents a pipeline handler.
	Written by: Nikita Petko
*/

import IPipelineHandler from './interfaces/pipeline_handler';
import IExecutionContext from './interfaces/execution_context';

/**
 * A class that represents a pipeline handler.
 * @template TInput The input type of the pipeline.
 * @template TOutput The output type of the pipeline.
 */
export default class PipelineHandler<TInput = unknown, TOutput = TInput> implements IPipelineHandler<TInput, TOutput> {
  /**
   * @internal This is a private member.
   */
  private _next?: IPipelineHandler<TInput, TOutput>;

  /**
   * Construct a new instance of the PipelineHandler class.
   * @param {IPipelineHandler<TInput, TOutput>?} next The next pipeline handler.
   */
  public constructor(next?: IPipelineHandler<TInput, TOutput>) {
    this._next = next;
  }

  /**
   * Get the next pipeline handler.
   * @returns {PipelineHandler<TInput, TOutput>} The next pipeline handler.
   */
  public get nextHandler(): IPipelineHandler<TInput, TOutput> | undefined {
    return this._next;
  }

  /**
   * Set the next pipeline handler.
   * @param {IPipelineHandler<TInput, TOutput>?} next The next pipeline handler.
   */
  public set nextHandler(next: IPipelineHandler<TInput, TOutput>) {
    this._next = next;
  }

  /**
   * Invoke the pipeline handler.
   * @param {IExecutionContext<TInput, TOutput>} context The execution context of the pipeline.
   */
  public invoke(context: IExecutionContext<TInput, TOutput>): void {
    if (context === undefined) {
      throw new Error('The context parameter is undefined.');
    }

    this._next?.invoke(context);
  }

  /**
   * Invoke the pipeline handler asynchronously.
   * @param {IExecutionContext<TInput, TOutput>} context The execution context of the pipeline.
   * @returns {Promise<void>} A promise that represents the asynchronous operation.
   */
  public async invokeAsync(context: IExecutionContext<TInput, TOutput>): Promise<void> {
    if (context === undefined) {
      throw new Error('The context parameter is undefined.');
    }

    await this._next?.invokeAsync(context);
  }
}
