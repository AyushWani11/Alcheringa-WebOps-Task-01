document.addEventListener('DOMContentLoaded', function () {
	const notif = document.getElementById('notif');
	const danger = document.querySelector('.danger');

	notif.textContent = 'Please wait while the data is being fetched';

	fetch('https://dummyjson.com/users')
		.then((response) => {
			console.log('resolved', response);
			return response.json();
		})
		.then((db) => {
			let dark = false;
			var data = db.users;
			const table = document.querySelector('.grid-table');
			data.forEach((person) => {
				const fullname = `${person.firstName} ${person.maidenName} ${person.lastName}`;
				const username = person.username;
				const email = person.email;

				var row = [fullname, username, email];

				const row_cells = [];

				row.forEach((e) => {
					const cell = document.createElement('span');
					if (dark) {
						cell.className = 'dark';
					}

					cell.textContent = e;
					table.appendChild(cell);
					row_cells.push(cell);
				});

				const last = document.createElement('span');
				if (dark) {
					last.className = 'dark';
				}
				const edit = document.createElement('button');

				edit.innerHTML =
					'<i class="fa-solid fa-floppy-disk"></i><span>Edit</span>';
				edit.className = 'edit';

				const del = document.createElement('button');
				del.className = 'del';
				del.innerHTML =
					'<i class="fa-solid fa-floppy-disk"></i><span>Delete</span>';

				del.addEventListener('click', function () {
					row_cells.forEach((e) => {
						table.removeChild(e);
					});
					table.removeChild(last);
					altColours();
					notif.textContent = 'Row successfully deleted!';
					danger.classList.remove('warning');
					danger.classList.add('success');
				});

				edit.addEventListener('click', function () {
					const editing = edit.innerHTML.includes('Save');
					if (editing) {
						let email = true;
						row_cells.forEach((cell) => {
							const input = cell.querySelector('input');
							if (input) {
								if (input.type === 'email' && !validateEmail(input.value)) {
									email = false;
									notif.textContent = 'Invalid email address!';
									danger.classList.remove('success');
									danger.classList.remove('warning');
								}
							}
						});
						if (email) {
							row_cells.forEach((cell) => {
								const input = cell.querySelector('input');
								if (input) {
									cell.textContent = input.value;
								}
							});
							edit.innerHTML =
								'<i class="fa-solid fa-floppy-disk"></i><span>Edit</span>';

							notif.textContent = 'Row successfully edited!';
							danger.classList.remove('warning');
							danger.classList.add('success');
						}
					} else {
						row_cells.forEach((cell, index) => {
							const input = document.createElement('input');
							input.type = 'text';
							if (index === 2) {
								input.type = 'email';
							}
							input.value = cell.textContent;
							cell.textContent = '';
							cell.appendChild(input);

							notif.textContent = 'Editing a row!';
							danger.classList.remove('success');
							danger.classList.add('warning');
						});
						edit.innerHTML =
							'<i class="fa-solid fa-floppy-disk"></i><span>Save</span>';
					}
				});

				last.classList.add('last');
				last.appendChild(edit);
				last.appendChild(del);
				table.appendChild(last);

				dark = !dark;
			});
			notif.textContent = 'Data Successfully Fetched!';
			danger.classList.add('success');
		})
		.catch((error) => {
			console.log('error fetching data', error);
			notif.textContent = 'Error Fetching Data!';
		});

	const menu = document.querySelector('#menu-icon');
	const sidebar = document.querySelector('aside');
	const mainPage = document.querySelector('.main');

	menu.addEventListener('click', function () {
		if (sidebar.classList.contains('active')) {
			sidebar.classList.remove('active');
			mainPage.classList.remove('active');
		} else {
			sidebar.classList.add('active');
			mainPage.classList.add('active');
		}
	});

	document.querySelectorAll('.menu-label').forEach((e) => {
		e.addEventListener('click', function () {
			const menuItem = this.parentElement;

			menuItem.classList.toggle('open');
		});
	});

	function altColours() {
		const table = document.querySelector('.grid-table');
		const cells = table.querySelectorAll(':scope > span');

		let rowNum = 0;

		cells.forEach((cell, index) => {
			if (index > 3) {
				cell.classList.remove('dark');
				if (index % 4 == 0) {
					rowNum++;
				}
				if (rowNum % 2 === 0) {
					cell.classList.add('dark');
				}
			}
		});
	}

	function validateEmail(email) {
		const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return re.test(String(email).toLowerCase());
	}
});
