// @ts-nocheck
import { useEffect, useRef, useState, type FC } from 'react'
import '@glideapps/glide-data-grid/dist/index.css'
import {
  DataEditor,
  GridCellKind,
  GridColumnIcon,
  type EditableGridCell,
  type GridCell,
  type Item
} from '@glideapps/glide-data-grid'

interface Person {
  name: string
  age: string
  isOpen: boolean
  hobby: string[]
  avatar: string[]
  notes: string
}

const POOL: Person[] = [
  { name: '合一', age: '15', isOpen: true, hobby: ['football', 'swimming'], avatar: ['https://i.pravatar.cc/300?img=3'], notes: '**markdown**' },
  { name: '合二', age: '18', isOpen: true, hobby: ['basketball'], avatar: ['https://i.pravatar.cc/300?img=1'], notes: 'true' },
  { name: '合三', age: '23', isOpen: false, hobby: ['basketball'], avatar: ['https://i.pravatar.cc/300?img=4'], notes: 'true' },
  { name: '合四', age: '25', isOpen: true, hobby: ['football'], avatar: ['https://i.pravatar.cc/300?img=5'], notes: 'true' }
]

const ROW_COUNT = 1_000_000

const data = Array.from({ length: ROW_COUNT }, (_, index) => {
  const item = POOL[index % POOL.length]
  return { ...item, id: String(index).padStart(6, '0') }
})

const columns = [
  { title: 'ID', width: 100, icon: GridColumnIcon.HeaderRowID },
  { title: '姓名', width: 100, icon: GridColumnIcon.HeaderString },
  { title: '年龄', width: 100 },
  { title: '状态', width: 50 },
  { title: '爱好', width: 200 },
  { title: '头像', width: 200 },
  { title: '笔记', width: 200 }
]

function getData([col, row]: Item): GridCell {
  const person = data[row]

  switch (col) {
    case 0:
      return { kind: GridCellKind.RowID, data: person.id, displayData: person.id, allowOverlay: false }
    case 1:
      return { kind: GridCellKind.Text, data: person.name, displayData: person.name, allowOverlay: true }
    case 2:
      return { kind: GridCellKind.Number, data: Number(person.age), displayData: person.age, allowOverlay: true }
    case 3:
      return { kind: GridCellKind.Boolean, data: person.isOpen, allowOverlay: false }
    case 4:
      return { kind: GridCellKind.Bubble, data: person.hobby }
    case 5:
      return { kind: GridCellKind.Image, data: person.avatar, allowOverlay: true }
    case 6:
      return { kind: GridCellKind.Markdown, data: person.notes, allowOverlay: true }
    default:
      return { kind: GridCellKind.Text, data: '', displayData: '' }
  }
}

const ReactDataSource: FC = () => {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ width: 500, height: 300 })

  useEffect(() => {
    if (!hostRef.current) return

    const calc = () => {
      const rect = hostRef.current!.getBoundingClientRect()
      setSize({ width: Math.max(rect.width, 200), height: Math.max(rect.height, 200) })
    }

    calc()

    const observer = new ResizeObserver(calc)
    observer.observe(hostRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={hostRef} style={{ width: '100%', height: '100%' }}>
      <DataEditor
        width={size.width}
        height={size.height}
        columns={columns}
        rows={data.length}
        getCellContent={getData}
        onCellEdited={(cell: Item, newValue: EditableGridCell) => console.log('edit', cell, newValue)}
      />
      <div id="portal" style={{ position: 'fixed', left: 0, top: 0, zIndex: 9999 }} />
    </div>
  )
}

export default ReactDataSource
