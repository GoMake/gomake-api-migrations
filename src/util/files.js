import fs from 'fs';
import {filter} from 'lodash';
import {map} from 'ramda';

const getFileNames = (folder) => new Promise((resolve, reject) => {
	fs.readdir(folder, (err, files) => {
		if (err) {
			reject(err);
			return;
		}
		resolve(files);
	});	
});

const extensionPatternFromString = ext => new RegExp(`${ext}$`);
const filterByExtension = ext => files => filter(files, migration => extensionPatternFromString(ext).test(migration));

const removeExtension = (ext, migration) => migration.replace(extensionPatternFromString(ext), '');
const removeExtensions = ext => files => files.map((file) => removeExtension(ext, file));


export {getFileNames};
export {extensionPatternFromString};
export {filterByExtension};
export {removeExtensions};