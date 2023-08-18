import { EntityRepository } from 'prizma/postgresql';
import { Task } from '../entities';

export class TaskRepository extends EntityRepository<Task> {}
