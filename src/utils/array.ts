// arrayMove([0,1,2,3,4,5,6,7,8,9], 3, 7)
// [0,1,2,4,5,6,7,3,8,9]
// arrayMove([0,1,2,3,4,5,6,7,8,9], 3, -1)
// [0,1,2,4,5,6,7,8,9,3]
export const arrayMove = <T>(arr: T[], from: number, to: number) => {
  const newArr = arr.slice()

  newArr.splice(to < 0 ? newArr.length + to : to, 0, newArr.splice(from, 1)[0])

  return newArr
}