import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class TasksController {
  public async index ({ view, auth }: HttpContextContract) {
    const user = auth.user
    await user?.preload('tasks')
    return view.render('tasks/index', { tasks: user?.tasks })
  }

  public async store ({ request, response, session, auth }: HttpContextContract) {
    const validationSchema = schema.create({
      title: schema.string({ trim: true }, [
        rules.maxLength(255),
      ]),
    })

    const validatedData = await request.validate({
      schema: validationSchema,
      messages: {
        'title.required': 'Enter task',
        'title.maxLength': 'Max 255 chars',
      },
    })
    await auth.user?.related('tasks').create({
      title: validatedData.title,
    })

    session.flash('notification', 'Task added')

    return response.redirect('back')
  }

  public async update ({request, response, session, params}: HttpContextContract) {
    const task = await Task.findOrFail(params.id)

    task.isCompleted = !!request.input('completed')
    await task.save()

    session.flash('notification', 'Task updated')

    return response.redirect('back')
  }

  public async destroy ({ params, session, response }: HttpContextContract) {
    const task = await Task.findOrFail(params.id)

    await task.delete()

    session.flash('notification', 'Task deleted')

    return response.redirect('back')
  }
}
