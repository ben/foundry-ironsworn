import { FileImporter } from 'sass'
import * as tsconfig from './tsconfig.json'

const importer: FileImporter<'sync'> = {
  findFileUrl: function (
    url: string,
    options: { fromImport: boolean }
  ): URL | null {
    const { paths, baseUrl } = tsconfig.compilerOptions as {
      paths: Record<string, string | string[]>
      baseUrl: string
    }

    const eligibleStubs
  },
}
