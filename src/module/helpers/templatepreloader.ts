// import '../../../system/templates/**/*.hbs'

export class TemplatePreloader {
  /**
   * Preload a set of templates to compile and cache them for fast access during rendering
   */
  static async preloadHandlebarsTemplates() {
    const templatePaths = ['__ALL_TEMPLATES__']

    return loadTemplates(templatePaths)
  }
}
