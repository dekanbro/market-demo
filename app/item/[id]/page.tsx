export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return items.map((item) => ({
    id: item.id,
  }))
}

