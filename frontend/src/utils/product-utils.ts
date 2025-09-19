
<<<<<<< HEAD
export function addSpacesToNumber(num: number) {
=======
export function addSpacesToNumber(num:number) {
>>>>>>> admin
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
