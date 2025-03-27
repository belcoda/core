import { returnLocalizationString as t, type SL } from '$lib/i18n/index';

export default function (locale: SL) {
	return {
		generic: {
			select: {
				placeholder: () => {
					return t(locale, {
						en: `Select an option`,
						ja: 'オプションを選択',
						pt: 'Selecione uma opção',
						es: 'Selecciona una opción',
						fr: 'Sélectionnez une option',
						sw: 'Chagua chaguo',
						th: 'เลือกตัวเลือก',
						zh: '选择一个选项'
					});
				}
			},
			country: {
				placeholder: () => {
					return t(locale, {
						en: 'Select a country',
						ja: '国を選択',
						pt: 'Selecione um país',
						es: 'Selecciona un país',
						fr: 'Sélectionnez un pays',
						sw: 'Chagua nchi',
						th: 'เลือกประเทศ',
						zh: '选择国家'
					});
				}
			},
			date: {
				placeholder: () => {
					return t(locale, {
						en: 'Select a date',
						ja: '日付を選択',
						pt: 'Selecione uma data',
						es: 'Selecciona una fecha',
						fr: 'Sélectionnez une date',
						sw: 'Chagua tarehe',
						th: 'เลือกวันที่',
						zh: '选择日期'
					});
				}
			}
		},
		fields: {
			generic: {
				filter: {
					placeholder: () => {
						return t(locale, {
							en: 'Filter',
							ja: 'フィルタ',
							pt: 'Filtro',
							es: 'Filtro',
							fr: 'Filtre',
							sw: 'Chuja',
							th: 'กรอง',
							zh: '过滤'
						});
					},
					types: {
						people: {
							placeholder: () => {
								return t(locale, {
									en: 'Search by name, email or phone number',
									ja: '名前、メールアドレス、電話番号で検索',
									pt: 'Pesquisar por nome, email ou número de telefone',
									es: 'Buscar por nombre, correo electrónico o número de teléfono',
									fr: 'Rechercher par nom, email ou numéro de téléphone',
									sw: 'Tafuta kwa jina, barua pepe au namba ya simu',
									th: 'ค้นหาตามชื่อ อีเมลหรือหมายเลขโทรศัพท์',
									zh: '按姓名、电子邮件或电话号码搜索'
								});
							}
						}
					}
				},
				full_name: {
					label: () => {
						return t(locale, {
							en: 'Full Name',
							ja: 'フルネーム',
							pt: 'Nome Completo',
							es: 'Nombre Completo',
							fr: 'Nom Complet',
							sw: 'Jina Kamili',
							th: 'ชื่อเต็ม',
							zh: '全名'
						});
					}
				},
				name: {
					label: () => {
						return t(locale, {
							en: 'Name',
							ja: '名前',
							pt: 'Nome',
							es: 'Nombre',
							fr: 'Nom',
							sw: 'Jina',
							th: 'ชื่อ',
							zh: '名称'
						});
					}
				},
				description: {
					label: () => {
						return t(locale, {
							en: 'Description',
							ja: '説明',
							pt: 'Descrição',
							es: 'Descripción',
							fr: 'Description',
							sw: 'Maelezo',
							th: 'คำอธิบาย',
							zh: '描述'
						});
					}
				},
				email: {
					label: () => {
						return t(locale, {
							en: 'Email',
							ja: 'Eメール',
							pt: 'Email',
							es: 'Correo Electrónico',
							fr: 'Email',
							sw: 'Barua pepe',
							th: 'อีเมล',
							zh: '电子邮件'
						});
					}
				},
				active: {
					label: () => {
						return t(locale, {
							en: 'Active',
							ja: 'アクティブ',
							pt: 'Ativo',
							es: 'Activo',
							fr: 'Actif',
							sw: 'Active',
							th: 'ใช้งาน',
							zh: '活跃'
						});
					}
				},
				url: {
					label: () => {
						return t(locale, {
							en: 'URL',
							ja: 'URL',
							pt: 'URL',
							es: 'URL',
							fr: 'URL',
							sw: 'URL',
							th: 'URL',
							zh: 'URL'
						});
					}
				},
				title: {
					label: () => {
						return t(locale, {
							en: 'Title',
							ja: 'タイトル',
							pt: 'Título',
							es: 'Título',
							fr: 'Titre',
							sw: 'Kichwa',
							th: 'หัวข้อ',
							zh: '标题'
						});
					}
				},
				page_heading: {
					label: () => {
						return t(locale, {
							en: 'Page Heading',
							ja: 'ページの見出し',
							pt: 'Título da Página',
							es: 'Encabezado de la Página',
							fr: 'En-tête de Page',
							sw: 'Kichwa cha Ukurasa',
							th: 'หัวเพจ',
							zh: '页面标题'
						});
					}
				},
				content: {
					label: () => {
						return t(locale, {
							en: 'Content',
							ja: 'コンテンツ',
							pt: 'Conteúdo',
							es: 'Contenido',
							fr: 'Contenu',
							sw: 'Yaliyomo',
							th: 'เนื้อหา',
							zh: '内容'
						});
					}
				},
				html: {
					label: () => {
						return t(locale, {
							en: 'HTML',
							ja: 'HTML',
							pt: 'HTML',
							es: 'HTML',
							fr: 'HTML',
							sw: 'HTML',
							th: 'HTML',
							zh: 'HTML'
						});
					}
				},
				plain_text: {
					label: () => {
						return t(locale, {
							en: 'Plain Text',
							ja: 'プレーンテキスト',
							pt: 'Texto Simples',
							es: 'Texto Plano',
							fr: 'Texte Brut',
							sw: 'Maandishi Rahisi',
							th: 'ข้อความธรรมดา',
							zh: '纯文本'
						});
					}
				},
				slug: {
					label: () => {
						return t(locale, {
							en: 'Slug',
							ja: 'スラッグ',
							pt: 'Slug',
							es: 'Slug',
							fr: 'Slug',
							sw: 'Slug',
							th: 'สลัก',
							zh: '子弹'
						});
					},
					description: () => {
						return t(locale, {
							en: 'Please use only lowercase alphanumeric characters and underscores. No spaces or special characters.',
							ja: '英数字とダッシュのみを使用してください。スペースや特殊文字は使用しないでください。',
							pt: 'Por favor, use apenas caracteres alfanuméricos e traços. Sem espaços ou caracteres especiais.',
							es: 'Por favor, use solo caracteres alfanuméricos y guiones. No use espacios ni caracteres especiales.',
							fr: "Veuillez utiliser uniquement des caractères alphanumériques et des tirets. Pas d'espaces ou de caractères spéciaux.",
							sw: 'Tafadhali tumia wahusika wa alfanumeriki na viashiria tu. Hakuna nafasi au wahusika maalum.',
							th: 'โปรดใช้ตัวอักษรและตัวเลขเท่านั้น และขีดล่าง ไม่มีช่องว่างหรืออักขระพิเศษ',
							zh: '请仅使用字母数字字符和破折号。不要使用空格或特殊字符。'
						});
					}
				},
				file_upload: {
					label: () => {
						return t(locale, {
							en: 'Upload a file',
							ja: 'ファイルをアップロード',
							pt: 'Carregar um arquivo',
							es: 'Subir un archivo',
							fr: 'Télécharger un fichier',
							sw: 'Pakia faili',
							th: 'อัปโหลดไฟล์',
							zh: '上传文件'
						});
					},
					description(fileFormats: string, maxSize: string) {
						return t(locale, {
							en: `Please upload a file. Accepted formats: ${fileFormats}. Maximum size: ${maxSize}`,
							ja: `ファイルをアップロードしてください。受け入れられる形式: ${fileFormats}。最大サイズ: ${maxSize}`,
							pt: `Por favor, carregue um arquivo. Formatos aceitos: ${fileFormats}. Tamanho máximo: ${maxSize}`,
							es: `Por favor, sube un archivo. Formatos aceptados: ${fileFormats}. Tamaño máximo: ${maxSize}`,
							fr: `Veuillez télécharger un fichier. Formats acceptés : ${fileFormats}. Taille maximale : ${maxSize}`,
							sw: `Tafadhali pakia faili. Miundo inayokubalika: ${fileFormats}. Ukubwa wa juu: ${maxSize}`,
							th: `โปรดอัปโหลดไฟล์ รูปแบบที่ยอมรับ: ${fileFormats} ขนาดสูงสุด: ${maxSize}`,
							zh: `请上传文件。接受的格式：${fileFormats}。最大尺寸：${maxSize}`
						});
					}
				},
				feature_image: {
					label: () => {
						return t(locale, {
							en: 'Feature Image',
							ja: '特集画像',
							pt: 'Imagem de Destaque',
							es: 'Imagen Destacada',
							fr: 'Image de Fonctionnalité',
							sw: 'Picha ya Kipekee',
							th: 'ภาพประกอบ',
							zh: '特色图片'
						});
					}
				},
				file_select_or_upload: {
					label: () => {
						return t(locale, {
							en: 'Select or upload a file',
							ja: 'ファイルを選択またはアップロード',
							pt: 'Selecionar ou carregar um arquivo',
							es: 'Seleccionar o subir un archivo',
							fr: 'Sélectionner ou télécharger un fichier',
							sw: 'Chagua au pakia faili',
							th: 'เลือกหรืออัปโหลดไฟล์',
							zh: '选择或上传文件'
						});
					}
				}
			},
			people: {
				full_name: {
					label: () => {
						return t(locale, {
							en: 'Full Name',
							ja: 'フルネーム',
							pt: 'Nome Completo',
							es: 'Nombre Completo',
							fr: 'Nom Complet',
							sw: 'Jina Kamili',
							th: 'ชื่อเต็ม',
							zh: '全名'
						});
					}
				},
				given_name: {
					label: () => {
						return t(locale, {
							en: 'Given Name',
							ja: '名',
							pt: 'Nome Próprio',
							es: 'Nombre de Pila',
							fr: 'Prénom',
							sw: 'Jina la Kwanza',
							th: 'ชื่อ',
							zh: '名'
						});
					}
				},
				dob: {
					label: () => {
						return t(locale, {
							en: 'Date of Birth',
							ja: '生年月日',
							pt: 'Data de Nascimento',
							es: 'Fecha de Nacimiento',
							fr: 'Date de Naissance',
							sw: 'Tarehe ya Kuzaliwa',
							th: 'วันเกิด',
							zh: '出生日期'
						});
					},
					description: () => {
						return t(locale, {
							en: 'Please use the format YYYY-MM-DD',
							ja: 'フォーマットはYYYY-MM-DDを使用してください',
							pt: 'Por favor, use o formato AAAA-MM-DD',
							es: 'Por favor, use el formato AAAA-MM-DD',
							fr: 'Veuillez utiliser le format AAAA-MM-DD',
							sw: 'Tafadhali tumia muundo wa YYYY-MM-DD',
							th: 'โปรดใช้รูปแบบ YYYY-MM-DD',
							zh: '请使用格式YYYY-MM-DD'
						});
					}
				},
				organization: {
					label: () => {
						return t(locale, {
							en: 'Organization',
							ja: '組織',
							pt: 'Organização',
							es: 'Organización',
							fr: 'Organisation',
							sw: 'Shirika',
							th: 'องค์กร',
							zh: '组织'
						});
					},
					description: () => {
						return t(locale, {
							en: 'The organization the person is associated with',
							ja: '人物が関連付けられている組織',
							pt: 'A organização com a qual a pessoa está associada',
							es: 'La organización con la que la persona está asociada',
							fr: "L'organisation à laquelle la personne est associée",
							sw: 'Shirika ambalo mtu anahusishwa nalo',
							th: 'องค์กรที่บุคคลเกี่ยวข้อง',
							zh: '人员所属的组织'
						});
					}
				},
				position: {
					label: () => {
						return t(locale, {
							en: 'Position',
							ja: 'ポジション',
							pt: 'Posição',
							es: 'Posición',
							fr: 'Position',
							sw: 'Nafasi',
							th: 'ตำแหน่ง',
							zh: '位置'
						});
					},
					description: () => {
						return t(locale, {
							en: 'The position the person holds in the organization',
							ja: '組織内での人物の地位',
							pt: 'A posição que a pessoa ocupa na organização',
							es: 'La posición que la persona ocupa en la organización',
							fr: "La position que la personne occupe dans l'organisation",
							sw: 'Nafasi ambayo mtu anashikilia katika shirika',
							th: 'ตำแหน่งที่บุคคลครองในองค์กร',
							zh: '人员在组织中的职位'
						});
					}
				},
				family_name: {
					label: () => {
						return t(locale, {
							en: 'Family Name',
							ja: '姓',
							pt: 'Sobrenome',
							es: 'Apellido',
							fr: 'Nom de Famille',
							sw: 'Jina la Familia',
							th: 'นามสกุล',
							zh: '姓'
						});
					}
				},
				given_name_alt: {
					label: () => {
						return t(locale, {
							en: 'Given Name (Alternate)',
							ja: '名（フリガナ）',
							pt: 'Nome Próprio (Alternativo)',
							es: 'Nombre de Pila (Alternativo)',
							fr: 'Prénom (Alternatif)',
							sw: 'Jina la Kwanza (Badala)',
							th: 'ชื่อ (ทดแทน)',
							zh: '名（替代）'
						});
					}
				},
				family_name_alt: {
					label: () => {
						return t(locale, {
							en: 'Family Name (Alternate)',
							ja: '姓（フリガナ）',
							pt: 'Sobrenome (Alternativo)',
							es: 'Apellido (Alternativo)',
							fr: 'Nom de Famille (Alternatif)',
							sw: 'Jina la Familia (Badala)',
							th: 'นามสกุล (ทดแทน)',
							zh: '姓（替代）'
						});
					}
				},
				preferred_name: {
					label: () => {
						return t(locale, {
							en: 'Preferred Name',
							ja: '通称名',
							pt: 'Nome Preferido',
							es: 'Nombre Preferido',
							fr: 'Nom Préféré',
							sw: 'Jina la Kupendelea',
							th: 'ชื่อที่ชอบ',
							zh: '首选名称'
						});
					},
					description: () => {
						return t(locale, {
							en: 'This will be used as a salutation on messages and other communications',
							ja: 'これはメッセージやその他のコミュニケーションで敬称として使用されます',
							pt: 'Isso será usado como saudação em mensagens e outras comunicações',
							es: 'Esto se usará como saludo en mensajes y otras comunicaciones',
							fr: 'Ceci sera utilisé comme salutation dans les messages et autres communications',
							sw: 'Hii itatumika kama salamu kwenye ujumbe na mawasiliano mengine',
							th: 'นี่จะถูกใช้เป็นคำทักทายในข้อความและการสื่อสารอื่น ๆ',
							zh: '这将用作消息和其他通信中的称呼'
						});
					}
				},
				details: {
					label: () => {
						return t(locale, {
							en: 'Details',
							ja: '詳細',
							pt: 'Detalhes',
							es: 'Detalles',
							fr: 'Détails',
							sw: 'Maelezo',
							th: 'รายละเอียด',
							zh: '细节'
						});
					},
					description: () => {
						return t(locale, {
							en: "Any useful information that doesn't fit in the other fields",
							ja: '他のフィールドに収まらない有用な個人情報',
							pt: 'Qualquer informação útil que não caiba nos outros campos',
							es: 'Cualquier información útil que no quepa en los otros campos',
							fr: 'Toute information utile qui ne rentre pas dans les autres champs',
							sw: 'Maelezo yoyote ya kibinafsi yanayofaa ambayo hayafai katika uga mwingine',
							th: 'ข้อมูลส่วนตัวที่เป็นประโยชน์ที่ไม่พอดีกับเขตอื่น ๆ',
							zh: '任何有用的个人信息，不适合其他字段'
						});
					}
				},
				do_not_contact: {
					label: () => {
						return t(locale, {
							en: 'Do Not Contact',
							ja: '連絡しないでください',
							pt: 'Não Contatar',
							es: 'No Contactar',
							fr: 'Ne Pas Contacter',
							sw: 'Usiwasiliane',
							th: 'อย่าติดต่อ',
							zh: '不要联系'
						});
					},
					description: () => {
						return t(locale, {
							en: "Stops the user from receiving all communications from the system. Useful for users who don't want to be contacted.",
							ja: 'ユーザーがシステムからのすべての通信を受け取らないようにします。連絡を受けたくないユーザーに便利です。',
							pt: 'Impede que o usuário receba todas as comunicações do sistema. Útil para usuários que não desejam ser contatados.',
							es: 'Detiene al usuario de recibir todas las comunicaciones del sistema. Útil para los usuarios que no desean ser contactados.',
							fr: "Empêche l'utilisateur de recevoir toutes les communications du système. Utile pour les utilisateurs qui ne veulent pas être contactés.",
							sw: 'Inazuia mtumiaji kupokea mawasiliano yote kutoka kwa mfumo. Inafaa kwa watumiaji ambao hawataki kuwasiliana.',
							th: 'หยุดผู้ใช้ไม่ให้รับการสื่อสารทั้งหมดจากระบบ มีประโยชน์สำหรับผู้ใช้ที่ไม่ต้องการให้ติดต่อ',
							zh: '阻止用户接收系统的所有通信。适用于不想被联系的用户。'
						});
					}
				},
				preferred_language: {
					label: () => {
						return t(locale, {
							en: 'Preferred Language',
							ja: '希望言語',
							pt: 'Idioma Preferido',
							es: 'Idioma Preferido',
							fr: 'Langue Préférée',
							sw: 'Lugha ya Kupendelea',
							th: 'ภาษาที่ชอบ',
							zh: '首选语言'
						});
					}
				},
				email_address: {
					label: () => {
						return t(locale, {
							en: 'Email Address',
							ja: 'Eメールアドレス',
							pt: 'Endereço de Email',
							es: 'Dirección de Correo Electrónico',
							fr: 'Adresse Email',
							sw: 'Anwani ya Barua pepe',
							th: 'ที่อยู่อีเมล',
							zh: '电子邮件地址'
						});
					},
					add_email_button: () => {
						return t(locale, {
							en: 'Add Email',
							ja: 'Eメールを追加',
							pt: 'Adicionar Email',
							es: 'Añadir Correo Electrónico',
							fr: 'Ajouter un Email',
							sw: 'Ongeza Barua pepe',
							th: 'เพิ่มอีเมล',
							zh: '添加电子邮件'
						});
					}
				},
				phone_number: {
					label: () => {
						return t(locale, {
							en: 'Phone Number',
							ja: '電話番号',
							pt: 'Número de Telefone',
							es: 'Número de Teléfono',
							fr: 'Numéro de Téléphone',
							sw: 'Namba ya Simu',
							th: 'หมายเลขโทรศัพท์',
							zh: '电话号码'
						});
					},
					add_phone_number_button: () => {
						return t(locale, {
							en: 'Add Phone Number',
							ja: '電話番号を追加',
							pt: 'Adicionar Número de Telefone',
							es: 'Añadir Número de Teléfono',
							fr: 'Ajouter un Numéro de Téléphone',
							sw: 'Ongeza Namba ya Simu',
							th: 'เพิ่มหมายเลขโทรศัพท์',
							zh: '添加电话号码'
						});
					}
				}
			},
			address: {
				address: {
					label: () => {
						return t(locale, {
							en: 'Address',
							ja: '住所',
							pt: 'Endereço',
							es: 'Dirección',
							fr: 'Adresse',
							sw: 'Anwani',
							th: 'ที่อยู่',
							zh: '地址'
						});
					}
				},
				address_line_1: {
					label: () => {
						return t(locale, {
							en: 'Address Line 1',
							ja: '住所1',
							pt: 'Endereço Linha 1',
							es: 'Dirección Línea 1',
							fr: 'Adresse Ligne 1',
							sw: 'Anwani Mstari 1',
							th: 'ที่อยู่บรรทัดที่ 1',
							zh: '地址行1'
						});
					},
					description: () => {
						return t(locale, {
							en: 'This is the first line of the address',
							ja: 'これは住所の第一行目です',
							pt: 'Esta é a primeira linha do endereço',
							es: 'Esta es la primera línea de la dirección',
							fr: "Ceci est la première ligne de l'adresse",
							sw: 'Huu ni mstari wa kwanza wa anwani',
							th: 'นี่คือบรรทัดแรกของที่อยู่',
							zh: '这是地址的第一行'
						});
					}
				},
				address_line_2: {
					label: () => {
						return t(locale, {
							en: 'Address Line 2',
							ja: '住所2',
							pt: 'Endereço Linha 2',
							es: 'Dirección Línea 2',
							fr: 'Adresse Ligne 2',
							sw: 'Anwani Mstari 2',
							th: 'ที่อยู่บรรทัดที่ 2',
							zh: '地址行2'
						});
					},
					description: () => {
						return t(locale, {
							en: 'This is the second line of the address',
							ja: 'これは住所の第二行目です',
							pt: 'Esta é a segunda linha do endereço',
							es: 'Esta es la segunda línea de la dirección',
							fr: "Ceci est la deuxième ligne de l'adresse",
							sw: 'Huu ni mstari wa pili wa anwani',
							th: 'นี่คือบรรทัดที่สองของที่อยู่',
							zh: '这是地址的第二行'
						});
					}
				},
				address_line_3: {
					label: () => {
						return t(locale, {
							en: 'Address Line 3',
							ja: '住所3',
							pt: 'Endereço Linha 3',
							es: 'Dirección Línea 3',
							fr: 'Adresse Ligne 3',
							sw: 'Anwani Mstari 3',
							th: 'ที่อยู่บรรทัดที่ 3',
							zh: '地址行3'
						});
					},
					description: () => {
						return t(locale, {
							en: 'This is the third line of the address',
							ja: 'これは住所の第三行目です',
							pt: 'Esta é a terceira linha do endereço',
							es: 'Esta es la tercera línea de la dirección',
							fr: "Ceci est la troisième ligne de l'adresse",
							sw: 'Huu ni mstari wa tatu wa anwani',
							th: 'นี่คือบรรทัดที่สามของที่อยู่',
							zh: '这是地址的第三行'
						});
					}
				},
				address_line_4: {
					label: () => {
						return t(locale, {
							en: 'Address Line 4',
							ja: '住所4',
							pt: 'Endereço Linha 4',
							es: 'Dirección Línea 4',
							fr: 'Adresse Ligne 4',
							sw: 'Anwani Mstari 4',
							th: 'ที่อยู่บรรทัดที่ 4',
							zh: '地址行4'
						});
					},
					description: () => {
						return t(locale, {
							en: 'This is the fourth line of the address',
							ja: 'これは住所の第四行目です',
							pt: 'Esta é a quarta linha do endereço',
							es: 'Esta es la cuarta línea de la dirección',
							fr: "Ceci est la quatrième ligne de l'adresse",
							sw: 'Huu ni mstari wa nne wa anwani',
							th: 'นี่คือบรรทัดที่สี่ของที่อยู่',
							zh: '这是地址的第四行'
						});
					}
				},
				locality: {
					label: () => {
						return t(locale, {
							en: 'Locality',
							ja: '地域',
							pt: 'Localidade',
							es: 'Localidad',
							fr: 'Localité',
							sw: 'Mtaa',
							th: 'ท้องถิ่น',
							zh: '地区'
						});
					},
					description: () => {
						return t(locale, {
							en: 'This is the locality of the address',
							ja: 'これは住所の地域です',
							pt: 'Esta é a localidade do endereço',
							es: 'Esta es la localidad de la dirección',
							fr: "Ceci est la localité de l'adresse",
							sw: 'Hii ni mtaa wa anwani',
							th: 'นี่คือท้องถิ่นของที่อยู่',
							zh: '这是地址的地区'
						});
					}
				},
				state: {
					label: () => {
						return t(locale, {
							en: 'State',
							ja: '州',
							pt: 'Estado',
							es: 'Estado',
							fr: 'État',
							sw: 'Jimbo',
							th: 'รัฐ',
							zh: '州'
						});
					},
					description: () => {
						return t(locale, {
							en: 'This is the state of the address',
							ja: 'これは住所の州です',
							pt: 'Este é o estado do endereço',
							es: 'Este es el estado de la dirección',
							fr: "Ceci est l'état de l'adresse",
							sw: 'Hii ni jimbo la anwani',
							th: 'นี่คือรัฐของที่อยู่',
							zh: '这是地址的州'
						});
					}
				},
				postcode: {
					label: () => {
						return t(locale, {
							en: 'Postcode',
							ja: '郵便番号',
							pt: 'Código Postal',
							es: 'Código Postal',
							fr: 'Code Postal',
							sw: 'Namba ya Posta',
							th: 'รหัสไปรษณีย์',
							zh: '邮政编码'
						});
					},
					description: () => {
						return t(locale, {
							en: 'This is the postcode of the address',
							ja: 'これは住所の郵便番号です',
							pt: 'Este é o código postal do endereço',
							es: 'Este es el código postal de la dirección',
							fr: "Ceci est le code postal de l'adresse",
							sw: 'Hii ni namba ya posta ya anwani',
							th: 'นี่คือรหัสไปรษณีย์ของที่อยู่',
							zh: '这是地址的邮政编码'
						});
					}
				},
				latlng: {
					label: () => {
						return t(locale, {
							en: 'Latitude and Longitude',
							ja: '緯度と経度',
							pt: 'Latitude e Longitude',
							es: 'Latitud y Longitud',
							fr: 'Latitude et Longitude',
							sw: 'Latitudo na Longitudo',
							th: 'ละติจูดและลองจิจูด',
							zh: '纬度和经度'
						});
					},
					description: () => {
						return t(locale, {
							en: 'These are the latitude and longitude coordinates',
							ja: 'これは緯度と経度の座標です',
							pt: 'Estas são as coordenadas de latitude e longitude',
							es: 'Estas son las coordenadas de latitud y longitud',
							fr: 'Ce sont les coordonnées de latitude et longitude',
							sw: 'Hizi ni kuratibu za latitudo na longitudo',
							th: 'นี่คือพิกัดละติจูดและลองจิจูด',
							zh: '这是纬度和经度坐标'
						});
					}
				},
				country: {
					label: () => {
						return t(locale, {
							en: 'Country',
							ja: '国',
							pt: 'País',
							es: 'País',
							fr: 'Pays',
							sw: 'Nchi',
							th: 'ประเทศ',
							zh: '国家'
						});
					},
					description: () => {
						return t(locale, {
							en: 'This is the country of the address',
							ja: 'これは住所の国です',
							pt: 'Este é o país do endereço',
							es: 'Este es el país de la dirección',
							fr: "Ceci est le pays de l'adresse",
							sw: 'Hii ni nchi ya anwani',
							th: 'นี่คือประเทศของที่อยู่',
							zh: '这是地址的国家'
						});
					}
				}
			},
			email: {
				subject: {
					label: () => {
						return t(locale, {
							en: 'Subject',
							ja: '件名',
							pt: 'Assunto',
							es: 'Asunto',
							fr: 'Sujet',
							sw: 'Mada',
							th: 'เรื่อง',
							zh: '主题'
						});
					}
				},
				from: {
					label: () => {
						return t(locale, {
							en: 'From',
							ja: 'から',
							pt: 'De',
							es: 'De',
							fr: 'De',
							sw: 'Kutoka',
							th: 'จาก',
							zh: '从'
						});
					},
					description: () => {
						return t(locale, {
							en: 'Use the format "Name <email@example.com>"',
							ja: 'フォーマット「名前 <email@example.com>」を使用してください',
							pt: 'Use o formato "Nome <email@example.com>"',
							es: 'Utilice el formato "Nombre <email@example.com>"',
							fr: 'Utilisez le format "Nom <email@example.com>"',
							sw: 'Tumia muundo "Jina <email@example.com>"',
							th: 'ใช้รูปแบบ "ชื่อ <email@example.com>"',
							zh: '使用格式“名称 <email@example.com>”'
						});
					}
				},
				reply_to: {
					label: () => {
						return t(locale, {
							en: 'Reply To',
							ja: '返信先',
							pt: 'Responder Para',
							es: 'Responder A',
							fr: 'Répondre à',
							sw: 'Jibu Kwa',
							th: 'ตอบกลับไปที่',
							zh: '回复'
						});
					},
					description: () => {
						return t(locale, {
							en: `The address that replies to this email will be sent to. If you change it, you will not automatically receive replies inside Belcoda.`,
							ja: `このメールに返信するアドレスが送信されます。変更すると、Belcoda内で自動的に返信を受け取ることはできません。`,
							pt: `O endereço para o qual as respostas a este email serão enviadas. Se você alterá-lo, não receberá automaticamente respostas dentro do Belcoda.`,
							es: `La dirección a la que se enviarán las respuestas a este correo electrónico. Si lo cambia, no recibirá automáticamente respuestas dentro de Belcoda.`,
							fr: `L'adresse à laquelle les réponses à cet e-mail seront envoyées. Si vous la modifiez, vous ne recevrez pas automatiquement de réponses à l'intérieur de Belcoda.`,
							sw: `Anwani ambayo majibu kwa barua pepe hii yatapelekwa. Ikiwa utaibadilisha, hutapokea majibu kiotomatiki ndani ya Belcoda.`,
							th: `ที่อยู่ที่จะส่งกลับไปยังอีเมลนี้ หากคุณเปลี่ยนมันคุณจะไม่ได้รับการตอบกลับอัตโนมัติภายใน Belcoda`,
							zh: `将回复此电子邮件的地址发送到。如果您更改它，您将无法在Belcoda内自动接收回复。`
						});
					}
				},
				advanced_settings: {
					warning: () => {
						return t(locale, {
							en: `You might not need to change these settings. The default settings are correct for the majority of cases, and making changes can break automatic handling of email replies and other features. Please read the documentation fully before making changes.`,
							ja: `これらの設定を変更する必要がない場合があります。デフォルト設定はほとんどの場合に適しており、変更すると電子メールの返信の自動処理やその他の機能が壊れる可能性があります。変更する前に文書を十分に読んでください。`,
							pt: `Você pode não precisar alterar essas configurações. As configurações padrão são corretas para a maioria dos casos e fazer alterações pode quebrar o tratamento automático de respostas de e-mail e outras funcionalidades. Por favor, leia a documentação completamente antes de fazer alterações.`,
							es: `Es posible que no necesite cambiar estas configuraciones. Las configuraciones predeterminadas son correctas para la mayoría de los casos y hacer cambios puede romper el manejo automático de respuestas de correo electrónico y otras funciones. Por favor, lea completamente la documentación antes de hacer cambios.`,
							fr: `Vous pourriez ne pas avoir besoin de modifier ces paramètres. Les paramètres par défaut sont corrects pour la plupart des cas, et apporter des modifications peut rompre le traitement automatique des réponses aux e-mails et d'autres fonctionnalités. Veuillez lire la documentation entièrement avant de faire des modifications.`,
							sw: `Huenda usihitaji kubadilisha mipangilio hii. Mipangilio ya msingi ni sahihi kwa kesi nyingi, na kufanya mabadiliko kunaweza kuvunja kushughulikia kiotomatiki cha majibu ya barua pepe na vipengele vingine. Tafadhali soma nyaraka kabisa kabla ya kufanya mabadiliko.`,
							th: `คุณอาจจะไม่จำเป็นต้องเปลี่ยนการตั้งค่าเหล่านี้ การตั้งค่าเริ่มต้นถูกต้องสำหรับกรณีส่วนใหญ่และการเปลี่ยนแปลงอาจทำให้การจัดการอัตโนมัติของการตอบกลับอีเมลและคุณลักษณะอื่น ๆ เสีย โปรดอ่านเอกสารอย่างเต็มที่ก่อนที่จะทำการเปลี่ยนแปลง`,
							zh: `您可能不需要更改这些设置。默认设置适用于大多数情况，进行更改可能会破坏电子邮件回复的自动处理和其他功能。请在进行更改之前完全阅读文档。`
						});
					}
				},
				preview_text: {
					label: () => {
						return t(locale, {
							en: 'Preview Text',
							ja: 'プレビューテキスト',
							pt: 'Texto de Pré-visualização',
							es: 'Texto de Vista Previa',
							fr: 'Texte de Prévisualisation',
							sw: 'Maandishi ya Hakikisho',
							th: 'ข้อความตัวอย่าง',
							zh: '预览文本'
						});
					},
					description: () => {
						return t(locale, {
							en: `This is the text that appears in the email client preview. If you don't make changes to this text, a preview will be automatically generated based on the email subject and body.`,
							ja: `これは電子メールクライアントのプレビューに表示されるテキストです。このテキストを変更しない場合、プレビューは電子メールの件名と本文に基づいて自動的に生成されます。`,
							pt: `Este é o texto que aparece na pré-visualização do cliente de email. Se você não fizer alterações neste texto, uma pré-visualização será gerada automaticamente com base no assunto e no corpo do email.`,
							es: `Este es el texto que aparece en la vista previa del cliente de correo electrónico. Si no realiza cambios en este texto, se generará automáticamente una vista previa basada en el asunto y el cuerpo del correo electrónico.`,
							fr: `C'est le texte qui apparaît dans l'aperçu du client de messagerie. Si vous ne modifiez pas ce texte, un aperçu sera automatiquement généré en fonction de l'objet et du corps du message.`,
							sw: `Hii ni maandishi yanayoonekana kwenye hakiki ya mteja wa barua pepe. Ikiwa hautafanya mabadiliko kwenye maandishi haya, hakiki itazalishwa kiotomatiki kulingana na somo la barua pepe na mwili.`,
							th: `นี่คือข้อความที่ปรากฏในการตัวอย่างของไคลเอนต์อีเมล หากคุณไม่ทำการเปลี่ยนแปลงข้อความนี้ จะมีการสร้างการตัวอย่างโดยอัตโนมัติขึ้นจากเรื่องและเนื้อหาของอีเมล`,
							zh: `这是出现在电子邮件客户端预览中的文本。如果您不对此文本进行更改，将根据电子邮件主题和正文自动生成预览。`
						});
					}
				},
				body: {
					label: () => {
						return t(locale, {
							en: 'Body',
							ja: '本文',
							pt: 'Corpo',
							es: 'Cuerpo',
							fr: 'Corps',
							sw: 'Mwili',
							th: 'ร่าง',
							zh: '身体'
						});
					}
				},
				useHtmlAsPlainText: {
					label: () => {
						return t(locale, {
							en: 'Use HTML as Plain Text',
							ja: 'HTMLをプレーンテキストとして使用',
							pt: 'Use HTML como Texto Simples',
							es: 'Utilizar HTML como Texto Plano',
							fr: 'Utiliser HTML comme texte brut',
							sw: 'Tumia HTML kama Maandishi Rahisi',
							th: 'ใช้ HTML เป็นข้อความธรรมดา',
							zh: '将HTML用作纯文本'
						});
					},
					description: () => {
						return t(locale, {
							en: 'If checked, a plain-text version will be generated and sent to users who cannot receive HTML emails.',
							ja: 'チェックを入れると、HTMLメールを受信できないユーザーにプレーンテキストバージョンが生成されて送信されます。',
							pt: 'Se marcado, uma versão de texto simples será gerada e enviada para usuários que não podem receber e-mails HTML.',
							es: 'Si está marcada, se generará una versión de texto plano y se enviará a los usuarios que no pueden recibir correos electrónicos HTML.',
							fr: "Si coché, une version en texte brut sera générée et envoyée aux utilisateurs qui ne peuvent pas recevoir d'e-mails HTML.",
							sw: 'Ikiwa imehakikiwa, toleo la maandishi rahisi litazalishwa na kutumwa kwa watumiaji ambao hawawezi kupokea barua pepe za HTML.',
							th: 'หากทำเครื่องหมายเช็ค จะสร้างเวอร์ชันข้อความธรรมดาและส่งไปยังผู้ใช้ที่ไม่สามารถรับอีเมล HTML',
							zh: '如果选中，将生成纯文本版本并发送给无法接收HTML电子邮件的用户。'
						});
					}
				},
				template: {
					label: () => {
						return t(locale, {
							en: 'Template',
							ja: 'テンプレート',
							pt: 'Modelo',
							es: 'Plantilla',
							fr: 'Modèle',
							sw: 'Kiolezo',
							th: 'เทมเพลต',
							zh: '模板'
						});
					},
					description: () => {
						return t(locale, {
							en: 'Select a template to use for the email. Templates can be managed in the "Email Templates" section.',
							ja: 'メールに使用するテンプレートを選択。 テンプレートは「メールテンプレート」セクションで管理できます。',
							pt: 'Selecione um modelo para usar no email. Os modelos podem ser gerenciados na seção "Modelos de Email".',
							es: 'Seleccione una plantilla para usar en el correo electrónico. Las plantillas se pueden gestionar en la sección "Plantillas de Correo Electrónico".',
							fr: "Sélectionnez un modèle à utiliser pour l'e-mail. Les modèles peuvent être gérés dans la section «Modèles d'e-mail».",
							sw: 'Chagua kiolezo cha kutumia kwa barua pepe. Violezo vinaweza kusimamiwa katika sehemu ya "Violezo vya Barua pepe".',
							th: 'เลือกเทมเพลตที่จะใช้สำหรับอีเมล เทมเพลตสามารถจัดการได้ในส่วน "เทมเพลตอีเมล"',
							zh: '选择要用于电子邮件的模板。 模板可以在“电子邮件模板”部分中管理。'
						});
					}
				},
				send_test_email: {
					label: () => {
						return t(locale, {
							en: 'Send Test Email',
							ja: 'テストメールを送信',
							pt: 'Enviar Email de Teste',
							es: 'Enviar Correo Electrónico de Prueba',
							fr: 'Envoyer un Email de Test',
							sw: 'Tuma Barua pepe ya Majaribio',
							th: 'ส่งอีเมลทดสอบ',
							zh: '发送测试电子邮件'
						});
					},
					description: () => {
						return t(locale, {
							en: '⚠️ Remember to save your changes before sending a test!',
							ja: '⚠️ テストを送信する前に変更を保存してください！',
							pt: '⚠️ Lembre-se de salvar suas alterações antes de enviar um teste!',
							es: '⚠️ ¡Recuerda guardar tus cambios antes de enviar una prueba!',
							fr: "⚠️ N'oubliez pas d'enregistrer vos modifications avant d'envoyer un test !",
							sw: '⚠️ Kumbuka kuokoa mabadiliko yako kabla ya kutuma mtihani!',
							th: '⚠️ จำไว้ว่าจะบันทึกการเปลี่ยนแปลงของคุณก่อนที่จะส่งทดสอบ!',
							zh: '⚠️ 在发送测试之前记得保存你的更改！'
						});
					}
				}
			},
			custom_code: {
				header: () => {
					return t(locale, {
						en: 'Custom code',
						ja: 'カスタムコード',
						pt: 'Código personalizado',
						es: 'Código personalizado',
						fr: 'Code personnalisé',
						sw: 'Hariri nambari ya kibinafsi',
						th: 'แก้ไขรหัสที่กำหนดเอง',
						zh: '编辑自定义代码'
					});
				},
				custom_css: {
					label: () => {
						return t(locale, {
							en: 'Custom CSS',
							ja: 'カスタムCSS',
							pt: 'CSS Personalizado',
							es: 'CSS Personalizado',
							fr: 'CSS personnalisé',
							sw: 'CSS ya kibinafsi',
							th: 'CSS ที่กำหนดเอง',
							zh: '自定义CSS'
						});
					},
					description: () => {
						return t(locale, {
							en: 'Add custom CSS. Will be added to at the end of the document <head>',
							ja: 'カスタムCSSを追加します。ドキュメントの最後に追加されます <head>',
							pt: 'Adicione CSS personalizado. Será adicionado ao final do documento <head>',
							es: 'Agregue CSS personalizado. Se agregará al final del documento <head>',
							fr: 'Ajoutez du CSS personnalisé. Sera ajouté à la fin du document <head>',
							sw: 'Ongeza CSS ya kibinafsi. Itaongezwa mwishoni mwa hati <head>',
							th: 'เพิ่ม CSS ที่กำหนดเอง จะถูกเพิ่มที่ส่วนท้ายของเอกสาร <head>',
							zh: '添加自定义CSS。将添加到文档的末尾 <head>'
						});
					}
				},
				custom_js: {
					label: () => {
						return t(locale, {
							en: 'Custom JS',
							ja: 'カスタムJS',
							pt: 'JS Personalizado',
							es: 'JS Personalizado',
							fr: 'JS personnalisé',
							sw: 'JS ya kibinafsi',
							th: 'JS ที่กำหนดเอง',
							zh: '自定义JS'
						});
					},
					description: () => {
						return t(locale, {
							en: 'Add custom JS. Will be added to at the end of the document <body>',
							ja: 'カスタムJSを追加します。ドキュメントの最後に追加されます <body>',
							pt: 'Adicione JS personalizado. Será adicionado ao final do documento <body>',
							es: 'Agregue JS personalizado. Se agregará al final del documento <body>',
							fr: 'Ajoutez du JS personnalisé. Sera ajouté à la fin du document <body>',
							sw: 'Ongeza JS ya kibinafsi. Itaongezwa mwishoni mwa hati <body>',
							th: 'เพิ่ม JS ที่กำหนดเอง จะถูกเพิ่มที่ส่วนท้ายของเอกสาร <body>',
							zh: '添加自定义JS。将添加到文档的末尾 <body>'
						});
					}
				},
				custom_html_head: {
					label: () => {
						return t(locale, {
							en: 'Custom HTML in <head>',
							ja: 'カスタムHTML <head>',
							pt: 'HTML Personalizado em <head>',
							es: 'HTML Personalizado en <head>',
							fr: 'HTML personnalisé dans <head>',
							sw: 'HTML ya kibinafsi katika <head>',
							th: 'HTML ที่กำหนดเองใน <head>',
							zh: '自定义<head>中的HTML'
						});
					},
					description: () => {
						return t(locale, {
							en: 'Add custom HTML to the document <head>',
							ja: 'カスタムHTMLをドキュメントに追加 <head>',
							pt: 'Adicione HTML personalizado ao documento <head>',
							es: 'Agregue HTML personalizado al documento <head>',
							fr: 'Ajoutez du HTML personnalisé au document <head>',
							sw: 'Ongeza HTML ya kibinafsi kwa hati <head>',
							th: 'เพิ่ม HTML ที่กำหนดเองในเอกสาร <head>',
							zh: '将自定义HTML添加到文档<head>'
						});
					}
				},
				custom_html_body: {
					label: () => {
						return t(locale, {
							en: 'Custom HTML in <body>',
							ja: 'カスタムHTML <body>',
							pt: 'HTML Personalizado em <body>',
							es: 'HTML Personalizado en <body>',
							fr: 'HTML personnalisé dans <body>',
							sw: 'HTML ya kibinafsi katika <body>',
							th: 'HTML ที่กำหนดเองใน <body>',
							zh: '自定义<body>中的HTML'
						});
					},
					description: () => {
						return t(locale, {
							en: 'Add custom HTML to the document <body>',
							ja: 'カスタムHTMLをドキュメントに追加 <body>',
							pt: 'Adicione HTML personalizado ao documento <body>',
							es: 'Agregue HTML personalizado al documento <body>',
							fr: 'Ajoutez du HTML personnalisé au document <body>',
							sw: 'Ongeza HTML ya kibinafsi kwa hati <body>',
							th: 'เพิ่ม HTML ที่กำหนดเองในเอกสาร <body>',
							zh: '将自定义HTML添加到文档<body>'
						});
					}
				}
			},
			feature_image: {
				label: () => {
					return t(locale, {
						en: 'Upload or select feature image'
					});
				}
			},
			metatags: {
				header: () => {
					return t(locale, {
						en: 'SEO/social media metatags',
						ja: 'SEO/SNSメタタグ',
						pt: 'Metatags de SEO/mídias sociais',
						es: 'Metatags de SEO/redes sociales',
						fr: 'Métadonnées SEO/réseaux sociaux',
						sw: 'Hariri metatags ya SEO/vyombo vya habari vya kijamii',
						th: 'แก้ไข SEO/โซเชียลมีเดียเมตาแท็ก',
						zh: '编辑SEO/社交媒体元标签'
					});
				},
				manually_generate: {
					label: () => {
						return t(locale, {
							en: 'Manually edit HTML metatags?'
						});
					},
					description: () => {
						return t(locale, {
							en: 'If manually editing is turned off, social media and SEO metatags will be automatically generated based on the content using AI.'
						});
					}
				},
				title: {
					label: () => {
						return t(locale, {
							en: 'Page title',
							ja: 'ページタイトル',
							pt: 'Título da Página',
							es: 'Título de la Página',
							fr: 'Titre de la Page',
							sw: 'Kichwa cha Ukurasa',
							th: 'ชื่อหน้า',
							zh: '页面标题'
						});
					},
					description: () => {
						return t(locale, {
							en: "This is the title that appears in the browser's title bar or tab",
							ja: 'これはブラウザのタイトルバーまたはタブに表示されるタイトルです',
							pt: 'Este é o título que aparece na barra de título ou aba do navegador',
							es: 'Este es el título que aparece en la barra de título o pestaña del navegador',
							fr: "C'est le titre qui apparaît dans la barre de titre ou l'onglet du navigateur",
							sw: 'Hii ndio kichwa kinachoonekana kwenye upau wa kichwa wa kivinjari au kichupo',
							th: 'นี่คือชื่อที่ปรากฏในแถบชื่อของเบราวเซอร์หรือแท็บ',
							zh: '这是出现在浏览器标题栏或选项卡中的标题'
						});
					}
				},
				description: {
					label: () => {
						return t(locale, {
							en: 'Page description',
							ja: 'ページの説明',
							pt: 'Descrição da Página',
							es: 'Descripción de la Página',
							fr: 'Description de la Page',
							sw: 'Maelezo ya Ukurasa',
							th: 'คำอธิบายของหน้า',
							zh: '页面描述'
						});
					},
					description: () => {
						return t(locale, {
							en: 'This is the description that appears in search engine results',
							ja: 'これは検索エンジンの検索結果に表示される説明です',
							pt: 'Esta é a descrição que aparece nos resultados dos motores de busca',
							es: 'Esta es la descripción que aparece en los resultados del motor de búsqueda',
							fr: "C'est la description qui apparaît dans les résultats des moteurs de recherche",
							sw: 'Hii ndio maelezo yanayoonekana kwenye matokeo ya injini ya utaftaji',
							th: 'นี่คือคำอธิบายที่ปรากฏในผลการค้นหาของเครื่องมือค้นหา',
							zh: '这是出现在搜索引擎结果中的描述'
						});
					}
				},
				subject: {
					label: () => {
						return t(locale, {
							en: 'Page subject',
							ja: 'ページの主題',
							pt: 'Assunto da Página',
							es: 'Tema de la Página',
							fr: 'Sujet de la Page',
							sw: 'Mada ya Ukurasa',
							th: 'หัวเรื่องของหน้า',
							zh: '页面主题'
						});
					},
					description: () => {
						return t(locale, {
							en: 'This is the subject of the page content',
							ja: 'これはページコンテンツの主題です',
							pt: 'Este é o assunto do conteúdo da página',
							es: 'Este es el tema del contenido de la página',
							fr: 'Ceci est le sujet du contenu de la page',
							sw: 'Hii ndio mada ya maudhui ya ukurasa',
							th: 'นี่คือหัวเรื่องของเนื้อหาหน้า',
							zh: '这是页面内容的主题'
						});
					}
				},
				keywords: {
					label: () => {
						return t(locale, {
							en: 'Keywords',
							ja: 'キーワード',
							pt: 'Palavras-chave',
							es: 'Palabras clave',
							fr: 'Mots-clés',
							sw: 'Maneno muhimu',
							th: 'คำสำคัญ',
							zh: '关键词'
						});
					},
					description: () => {
						return t(locale, {
							en: 'These are the keywords associated with the page content',
							ja: 'これらはページコンテンツに関連するキーワードです',
							pt: 'Estas são as palavras-chave associadas ao conteúdo da página',
							es: 'Estas son las palabras clave asociadas con el contenido de la página',
							fr: 'Ce sont les mots-clés associés au contenu de la page',
							sw: 'Haya ni maneno muhimu yanayohusiana na maudhui ya ukurasa',
							th: 'นี่คือคำสำคัญที่เกี่ยวข้องกับเนื้อหาหน้า',
							zh: '这些是与页面内容相关的关键词'
						});
					}
				},
				open_graph: {
					title: {
						label: () => {
							return t(locale, {
								en: 'Open Graph Title',
								ja: 'オープングラフのタイトル',
								pt: 'Título do Open Graph',
								es: 'Título de Open Graph',
								fr: 'Titre Open Graph',
								sw: 'Kichwa cha Open Graph',
								th: 'ชื่อ Open Graph',
								zh: 'Open Graph 标题'
							});
						},
						description: () => {
							return t(locale, {
								en: 'This is the title used for Open Graph sharing',
								ja: 'これはオープングラフ共有に使用されるタイトルです',
								pt: 'Este é o título usado para compartilhamento Open Graph',
								es: 'Este es el título utilizado para compartir en Open Graph',
								fr: 'Ceci est le titre utilisé pour le partage Open Graph',
								sw: 'Hiki ndicho kichwa kinachotumiwa kwa kushiriki Open Graph',
								th: 'นี่คือชื่อที่ใช้สำหรับการแชร์ Open Graph',
								zh: '这是用于 Open Graph 分享的标题'
							});
						}
					},
					description: {
						label: () => {
							return t(locale, {
								en: 'Open Graph Description',
								ja: 'オープングラフの説明',
								pt: 'Descrição do Open Graph',
								es: 'Descripción de Open Graph',
								fr: 'Description Open Graph',
								sw: 'Maelezo ya Open Graph',
								th: 'คำอธิบาย Open Graph',
								zh: 'Open Graph 描述'
							});
						},
						description: () => {
							return t(locale, {
								en: 'This is the description used for Open Graph sharing',
								ja: 'これはオープングラフ共有に使用される説明です',
								pt: 'Esta é a descrição usada para compartilhamento Open Graph',
								es: 'Esta es la descripción utilizada para compartir en Open Graph',
								fr: 'Ceci est la description utilisée pour le partage Open Graph',
								sw: 'Hii ndio maelezo yanayotumiwa kwa kushiriki Open Graph',
								th: 'นี่คือคำอธิบายที่ใช้สำหรับการแชร์ Open Graph',
								zh: '这是用于 Open Graph 分享的描述'
							});
						}
					},
					image: {
						label: () => {
							return t(locale, {
								en: 'Open Graph Image',
								ja: 'オープングラフの画像',
								pt: 'Imagem do Open Graph',
								es: 'Imagen de Open Graph',
								fr: 'Image Open Graph',
								sw: 'Picha ya Open Graph',
								th: 'รูปภาพ Open Graph',
								zh: 'Open Graph 图片'
							});
						},
						description: () => {
							return t(locale, {
								en: 'This is the image used for Open Graph sharing',
								ja: 'これはオープングラフ共有に使用される画像です',
								pt: 'Esta é a imagem usada para compartilhamento Open Graph',
								es: 'Esta es la imagen utilizada para compartir en Open Graph',
								fr: "Ceci est l'image utilisée pour le partage Open Graph",
								sw: 'Hii ndio picha inayotumiwa kwa kushiriki Open Graph',
								th: 'นี่คือรูปภาพที่ใช้สำหรับการแชร์ Open Graph',
								zh: '这是用于 Open Graph 分享的图片'
							});
						}
					},
					image_alt: {
						label: () => {
							return t(locale, {
								en: 'Open Graph Image Alt Text',
								ja: 'オープングラフの画像の代替テキスト',
								pt: 'Texto Alternativo da Imagem do Open Graph',
								es: 'Texto Alternativo de la Imagen de Open Graph',
								fr: "Texte Alternatif de l'Image Open Graph",
								sw: 'Maandishi Mbadala ya Picha ya Open Graph',
								th: 'ข้อความแทนรูปภาพ Open Graph',
								zh: 'Open Graph 图片替代文本'
							});
						},
						description: () => {
							return t(locale, {
								en: 'This is the alt text for the image used in Open Graph sharing',
								ja: 'これはオープングラフ共有に使用される画像の代替テキストです',
								pt: 'Este é o texto alternativo para a imagem usada no compartilhamento Open Graph',
								es: 'Este es el texto alternativo para la imagen utilizada en Open Graph',
								fr: "Ceci est le texte alternatif de l'image utilisée pour le partage Open Graph",
								sw: 'Hii ndio maandishi mbadala ya picha inayotumiwa kwa kushiriki Open Graph',
								th: 'นี่คือข้อความแทนสำหรับรูปภาพที่ใช้ใน Open Graph',
								zh: '这是用于 Open Graph 分享的图片替代文本'
							});
						}
					}
				},
				twitter: {
					title: {
						label: () => {
							return t(locale, {
								en: 'Twitter Title',
								ja: 'Twitterのタイトル',
								pt: 'Título do Twitter',
								es: 'Título de Twitter',
								fr: 'Titre Twitter',
								sw: 'Kichwa cha Twitter',
								th: 'ชื่อ Twitter',
								zh: 'Twitter 标题'
							});
						},
						description: () => {
							return t(locale, {
								en: 'This is the title used for Twitter sharing',
								ja: 'これはTwitter共有に使用されるタイトルです',
								pt: 'Este é o título usado para compartilhamento no Twitter',
								es: 'Este es el título utilizado para compartir en Twitter',
								fr: 'Ceci est le titre utilisé pour le partage sur Twitter',
								sw: 'Hiki ndicho kichwa kinachotumiwa kwa kushiriki kwenye Twitter',
								th: 'นี่คือชื่อที่ใช้สำหรับการแชร์ทวิตเตอร์',
								zh: '这是用于 Twitter 分享的标题'
							});
						}
					},
					description: {
						label: () => {
							return t(locale, {
								en: 'Twitter Description',
								ja: 'Twitterの説明',
								pt: 'Descrição do Twitter',
								es: 'Descripción de Twitter',
								fr: 'Description Twitter',
								sw: 'Maelezo ya Twitter',
								th: 'คำอธิบาย Twitter',
								zh: 'Twitter 描述'
							});
						},
						description: () => {
							return t(locale, {
								en: 'This is the description used for Twitter sharing',
								ja: 'これはTwitter共有に使用される説明です',
								pt: 'Esta é a descrição usada para compartilhamento no Twitter',
								es: 'Esta es la descripción utilizada para compartir en Twitter',
								fr: 'Ceci est la description utilisée pour le partage sur Twitter',
								sw: 'Hii ndio maelezo yanayotumiwa kwa kushiriki kwenye Twitter',
								th: 'นี่คือคำอธิบายที่ใช้สำหรับการแชร์ทวิตเตอร์',
								zh: '这是用于 Twitter 分享的描述'
							});
						}
					},
					card: {
						label: () => {
							return t(locale, {
								en: 'Twitter Card Type',
								ja: 'Twitterカードタイプ',
								pt: 'Tipo de Cartão do Twitter',
								es: 'Tipo de Tarjeta de Twitter',
								fr: 'Type de Carte Twitter',
								sw: 'Aina ya Kadi ya Twitter',
								th: 'ประเภทการ์ด Twitter',
								zh: 'Twitter 卡片类型'
							});
						},
						description: () => {
							return t(locale, {
								en: 'This is the type of Twitter card used for sharing',
								ja: 'これは共有に使用されるTwitterカードのタイプです',
								pt: 'Este é o tipo de cartão do Twitter usado para compartilhamento',
								es: 'Este es el tipo de tarjeta de Twitter utilizada para compartir',
								fr: 'Ceci est le type de carte Twitter utilisé pour le partage',
								sw: 'Hii ndio aina ya kadi ya Twitter inayotumiwa kwa kushiriki',
								th: 'นี่คือประเภทของการ์ด Twitter ที่ใช้สำหรับการแชร์',
								zh: '这是用于分享的 Twitter 卡片类型'
							});
						}
					},
					image: {
						label: () => {
							return t(locale, {
								en: 'Twitter Image',
								ja: 'Twitterの画像',
								pt: 'Imagem do Twitter',
								es: 'Imagen de Twitter',
								fr: 'Image Twitter',
								sw: 'Picha ya Twitter',
								th: 'รูปภาพ Twitter',
								zh: 'Twitter 图片'
							});
						},
						description: () => {
							return t(locale, {
								en: 'This is the image used for Twitter sharing',
								ja: 'これはTwitter共有に使用される画像です',
								pt: 'Esta é a imagem usada para compartilhamento no Twitter',
								es: 'Esta es la imagen utilizada para compartir en Twitter',
								fr: "Ceci est l'image utilisée pour le partage sur Twitter",
								sw: 'Hii ndio picha inayotumiwa kwa kushiriki kwenye Twitter',
								th: 'นี่คือรูปภาพที่ใช้สำหรับการแชร์ทวิตเตอร์',
								zh: '这是用于 Twitter 分享的图片'
							});
						}
					},
					image_alt: {
						label: () => {
							return t(locale, {
								en: 'Twitter Image Alt Text',
								ja: 'Twitterの画像の代替テキスト',
								pt: 'Texto Alternativo da Imagem do Twitter',
								es: 'Texto Alternativo de la Imagen de Twitter',
								fr: "Texte Alternatif de l'Image Twitter",
								sw: 'Maandishi Mbadala ya Picha ya Twitter',
								th: 'ข้อความแทนรูปภาพ Twitter',
								zh: 'Twitter 图片替代文本'
							});
						},
						description: () => {
							return t(locale, {
								en: 'This is the alt text for the image used in Twitter sharing',
								ja: 'これはTwitter共有に使用される画像の代替テキストです',
								pt: 'Este é o texto alternativo para a imagem usada no compartilhamento no Twitter',
								es: 'Este es el texto alternativo para la imagen utilizada en Twitter',
								fr: "Ceci est le texte alternatif de l'image utilisée pour le partage sur Twitter",
								sw: 'Hii ndio maandishi mbadala ya picha inayotumiwa kwa kushiriki kwenye Twitter',
								th: 'นี่คือข้อความแทนสำหรับรูปภาพที่ใช้ในการแชร์ทวิตเตอร์',
								zh: '这是用于 Twitter 分享的图片替代文本'
							});
						}
					}
				}
			},
			events: {
				online: {
					label: () => {
						return t(locale, {
							en: 'Online Event',
							ja: 'オンラインイベント',
							pt: 'Evento Online',
							es: 'Evento en Línea',
							fr: 'Événement en Ligne',
							sw: 'Tukio la Mtandaoni',
							th: 'เหตุการณ์ออนไลน์',
							zh: '在线活动'
						});
					},
					description: () => {
						return t(locale, {
							en: 'Is this an online event, or does it have a physical location?',
							ja: 'これはオンラインイベントですか、それとも物理的な場所がありますか？',
							pt: 'Este é um evento online, ou tem um local físico?',
							es: '¿Este es un evento en línea, o tiene una ubicación física?',
							fr: "S'agit-il d'un événement en ligne, ou a-t-il un emplacement physique?",
							sw: 'Je, hii ni tukio la mtandaoni, au lina mahali pa kimwili?',
							th: 'นี่เป็นเหตุการณ์ออนไลน์หรือมีสถานที่ที่ตั้ง?',
							zh: '这是在线活动，还是有实际位置？'
						});
					}
				},
				event_page_link: {
					label: () => {
						return t(locale, {
							en: 'Event Page Link',
							ja: 'イベントページリンク',
							pt: 'Link da Página do Evento',
							es: 'Enlace de la Página del Evento',
							fr: "Lien de la Page de l'Événement",
							sw: 'Kiungo cha Ukurasa wa Tukio',
							th: 'ลิงก์หน้าเหตการณ์',
							zh: '活动页面链接'
						});
					}
				},
				event_title: {
					label: () => {
						return t(locale, {
							en: 'Event Title',
							ja: 'イベントタイトル',
							pt: 'Título do Evento',
							es: 'Título del Evento',
							fr: "Titre de l'Événement",
							sw: 'Kichwa cha Tukio',
							th: 'ชื่อเหตการณ์',
							zh: '活动标题'
						});
					}
				},
				event_details: {
					label: () => {
						return t(locale, {
							en: 'Event Details',
							ja: 'イベントの詳細',
							pt: 'Detalhes do Evento',
							es: 'Detalles del Evento',
							fr: 'Détails de l’Événement',
							sw: 'Maelezo ya Tukio',
							th: 'รายละเอียดเหตการณ์',
							zh: '活动详情'
						});
					},
					description: () => {
						return t(locale, {
							en: "Details about the event. This will be displayed on the event's page",
							ja: 'イベントに関する詳細。これはイベントページに表示されます',
							pt: 'Detalhes sobre o evento. Isso será exibido na página do evento',
							es: 'Detalles sobre el evento. Esto se mostrará en la página del evento',
							fr: "Détails sur l'événement. Cela sera affiché sur la page de l'événement",
							sw: 'Maelezo kuhusu tukio. Hii itaonyeshwa kwenye ukurasa wa tukio',
							th: 'รายละเอียดเกี่ยวกับเหตการณ์ นี่จะปรากฏบนหน้าเหตการณ์',
							zh: '活动详情。这将显示在活动页面上'
						});
					}
				},
				online_url: {
					label: () => {
						return t(locale, {
							en: 'Online Event URL',
							ja: 'オンラインイベントURL',
							pt: 'URL do Evento Online',
							es: 'URL del Evento en Línea',
							fr: 'URL de l’Événement en Ligne',
							sw: 'URL ya Tukio la Mtandaoni',
							th: 'URL ของเหตุการณ์ออนไลน์',
							zh: '在线活动URL'
						});
					},
					description: () => {
						return t(locale, {
							en: 'The URL for the online event',
							ja: 'オンラインイベントのURL',
							pt: 'O URL do evento online',
							es: 'La URL del evento en línea',
							fr: "L'URL de l'événement en ligne",
							sw: 'URL ya tukio la mtandaoni',
							th: 'URL ของเหตการณ์ออนไลน์',
							zh: '在线活动的URL'
						});
					}
				},
				online_instructions: {
					label: () => {
						return t(locale, {
							en: 'Online Event Instructions',
							ja: 'オンラインイベントの説明',
							pt: 'Instruções do Evento Online',
							es: 'Instrucciones del Evento en Línea',
							fr: 'Instructions de l’Événement en Ligne',
							sw: 'Maelekezo ya Tukio la Mtandaoni',
							th: 'คำแนะนำเหตการณ์ออนไลน์',
							zh: '在线活动说明'
						});
					},
					description: () => {
						return t(locale, {
							en: 'Instructions for the online event',
							ja: 'オンラインイベントの説明',
							pt: 'Instruções para o evento online',
							es: 'Instrucciones para el evento en línea',
							fr: "Instructions pour l'événement en ligne",
							sw: 'Maelekezo ya tukio la mtandaoni',
							th: 'คำแนะนำสำหรับเหตการณ์ออนไลน์',
							zh: '在线活动说明'
						});
					}
				},
				attendees: {
					send_notifications: {
						label: () => {
							return t(locale, {
								en: 'Send notifications?',
								ja: '報告を届ける？'
							});
						}
					}
				},
				advanced_settings: {
					label: () => {
						return t(locale, {
							en: 'Advanced settings'
						});
					}
				},
				user_information_settings: {
					label: () => {
						return t(locale, {
							en: 'User Information Settings',
							ja: 'ユーザー情報設定',
							pt: 'Configurações de Informações do Usuário',
							es: 'Configuración de Información del Usuario',
							fr: 'Paramètres des Informations Utilisateur',
							sw: 'Mipangilio ya Taarifa za Mtumiaji',
							th: 'การตั้งค่าข้อมูลผู้ใช้',
							zh: '用户信息设置'
						});
					},
					fields: {
						ask_email: {
							label: () => {
								return t(locale, {
									en: 'Ask for email address',
									ja: 'メールアドレスを尋ねる',
									pt: 'Solicitar e-mail',
									es: 'Solicitar correo electrónico',
									fr: 'Demander un e-mail',
									sw: 'Uliza barua pepe',
									th: 'ขออีเมล',
									zh: '要求电子邮件'
								});
							}
						},
						require_email: {
							label: () => {
								return t(locale, {
									en: 'Require email address',
									ja: 'メールアドレスが必要',
									pt: 'E-mail obrigatório',
									es: 'Correo electrónico requerido',
									fr: 'E-mail requis',
									sw: 'Barua pepe inahitajika',
									th: 'ต้องการอีเมล',
									zh: '需要电子邮件'
								});
							}
						},
						ask_phone_number: {
							label: () => {
								return t(locale, {
									en: 'Ask for phone number',
									ja: '電話番号を尋ねる',
									pt: 'Solicitar número de telefone',
									es: 'Solicitar número de teléfono',
									fr: 'Demander un numéro de téléphone',
									sw: 'Uliza namba ya simu',
									th: 'ขอหมายเลขโทรศัพท์',
									zh: '要求电话号码'
								});
							}
						},
						require_phone_number: {
							label: () => {
								return t(locale, {
									en: 'Require phone number',
									ja: '電話番号が必要',
									pt: 'Número de telefone obrigatório',
									es: 'Número de teléfono requerido',
									fr: 'Numéro de téléphone requis',
									sw: 'Namba ya simu inahitajika',
									th: 'ต้องการหมายเลขโทรศัพท์',
									zh: '需要电话号码'
								});
							}
						},
						ask_postcode: {
							label: () => {
								return t(locale, {
									en: 'Ask for postal code',
									ja: '郵便番号を尋ねる',
									pt: 'Solicitar código postal',
									es: 'Solicitar código postal',
									fr: 'Demander un code postal',
									sw: 'Uliza msimbo wa posta',
									th: 'ขอรหัสไปรษณีย์',
									zh: '要求邮政编码'
								});
							}
						},
						require_postcode: {
							label: () => {
								return t(locale, {
									en: 'Require postal code',
									ja: '郵便番号が必要',
									pt: 'Código postal obrigatório',
									es: 'Código postal requerido',
									fr: 'Code postal requis',
									sw: 'Msimbo wa posta unahitajika',
									th: 'ต้องการรหัสไปรษณีย์',
									zh: '需要邮政编码'
								});
							}
						},
						ask_full_address: {
							label: () => {
								return t(locale, {
									en: 'Ask for full address',
									ja: '住所を尋ねる',
									pt: 'Solicitar endereço completo',
									es: 'Solicitar dirección completa',
									fr: 'Demander une adresse complète',
									sw: 'Uliza anwani kamili',
									th: 'ขอที่อยู่เต็ม',
									zh: '要求完整地址'
								});
							}
						},
						require_full_address: {
							label: () => {
								return t(locale, {
									en: 'Require full address',
									ja: '住所が必要',
									pt: 'Endereço completo obrigatório',
									es: 'Dirección completa requerida',
									fr: 'Adresse complète requise',
									sw: 'Anwani kamili inahitajika',
									th: 'ต้องการที่อยู่เต็ม',
									zh: '需要完整地址'
								});
							}
						}
					}
				},
				email_notification_settings: {
					send_registration_email: {
						label: () => {
							return t(locale, {
								en: 'Send registration email',
								ja: '登録メールを送信',
								pt: 'Enviar e-mail de registro',
								es: 'Enviar correo electrónico de registro',
								fr: 'Envoyer un e-mail d’inscription',
								sw: 'Tuma barua pepe ya usajili',
								th: 'ส่งอีเมลลงทะเบียน',
								zh: '发送注册电子邮件'
							});
						},
						description: () => {
							return t(locale, {
								en: 'Do you want to send an automatic email notification to the user when they register for the event?',
								ja: 'ユーザーがイベントに登録するときに自動的にメール通知を送信しますか？',
								pt: 'Você deseja enviar uma notificação por e-mail automática para o usuário quando ele se registrar para o evento?',
								es: '¿Desea enviar una notificación por correo electrónico automática al usuario cuando se registre para el evento?',
								fr: 'Souhaitez-vous envoyer une notification par e-mail automatique à l’utilisateur lorsqu’il s’inscrit à l’événement?',
								sw: 'Je, unataka kutuma taarifa ya barua pepe kiotomatiki kwa mtumiaji anapojisajili kwa tukio?',
								th: 'คุณต้องการส่งอีเมลล์แจ้งเตือนอัตโนมัติให้ผู้ใช้เมื่อลงทะเบียนเข้าร่วมกิจกรรมหรือไม่?',
								zh: '您是否希望用户注册活动时自动发送电子邮件通知？'
							});
						}
					},
					send_reminder_email: {
						label: () => {
							return t(locale, {
								en: 'Send reminder email',
								ja: 'リマインダーメールを送信',
								pt: 'Enviar e-mail de lembrete',
								es: 'Enviar correo electrónico de recordatorio',
								fr: 'Envoyer un e-mail de rappel',
								sw: 'Tuma barua pepe ya kukumbusha',
								th: 'ส่งอีเมลล์เตือน',
								zh: '发送提醒电子邮件'
							});
						},
						description: () => {
							return t(locale, {
								en: 'Do you want to send an automatic email reminder to the user before the event starts?',
								ja: 'イベントが開始する前にユーザーに自動的なリマインダーメールを送信しますか？',
								pt: 'Você deseja enviar um lembrete por e-mail automático para o usuário antes do início do evento?',
								es: '¿Desea enviar un recordatorio por correo electrónico automático al usuario antes de que comience el evento?',
								fr: 'Souhaitez-vous envoyer un rappel par e-mail automatique à l’utilisateur avant le début de l’événement?',
								sw: 'Je, unataka kutuma barua pepe ya kukumbusha kiotomatiki kwa mtumiaji kabla ya tukio kuanza?',
								th: 'คุณต้องการส่งอีเมลล์เตือนอัตโนมัติให้ผู้ใช้ก่อนที่กิจกรรมจะเริ่ม?',
								zh: '您是否希望在活动开始前向用户发送自动电子邮件提醒？'
							});
						},
						sent: (time_ago: string) => {
							return t(locale, {
								en: `Sent ${time_ago}`,
								ja: `${time_ago} 送信済み`,
								pt: `Enviado ${time_ago}`,
								es: `Enviado ${time_ago}`,
								fr: `Envoyé ${time_ago}`,
								sw: `Imetumwa ${time_ago}`,
								th: `ส่ง ${time_ago}`,
								zh: `发送 ${time_ago}`
							});
						},
						hours_before_start: {
							label: () => {
								return t(locale, {
									en: 'How many hours before the event starts should the reminder be sent?',
									ja: 'イベントが開始する何時間前にリマインダーを送信しますか？',
									pt: 'Quantas horas antes do início do evento o lembrete deve ser enviado?',
									es: '¿Cuántas horas antes de que comience el evento se debe enviar el recordatorio?',
									fr: "Combien d'heures avant le début de l'événement le rappel doit-il être envoyé?",
									sw: 'Masaa mangapi kabla ya tukio kuanza kukumbusha itumwe?',
									th: 'กี่ชั่วโมงก่อนที่กิจกรรมจะเริ่มควรส่งการแจ้งเตือน?',
									zh: '活动开始前多少小时应发送提醒？'
								});
							}
						}
					},
					send_cancellation_email: {
						label: () => {
							return t(locale, {
								en: 'Send cancellation email',
								ja: 'キャンセルメールを送信',
								pt: 'Enviar e-mail de cancelamento',
								es: 'Enviar correo electrónico de cancelación',
								fr: 'Envoyer un e-mail d’annulation',
								sw: 'Tuma barua pepe ya kufuta',
								th: 'ส่งอีเมลล์ยกเลิก',
								zh: '发送取消电子邮件'
							});
						},
						description: () => {
							return t(locale, {
								en: 'Do you want to send an automatic email notification to the user if they cancel their registration? This is separate to the cancellation notification sent if the event itself is cancelled.',
								ja: 'ユーザーが登録をキャンセルした場合、自動的にメール通知を送信しますか？',
								pt: 'Você deseja enviar uma notificação por e-mail automática para o usuário se ele cancelar o registro?',
								es: '¿Desea enviar una notificación por correo electrónico automática al usuario si cancela su registro?',
								fr: 'Souhaitez-vous envoyer une notification par e-mail automatique à l’utilisateur s’il annule son inscription?',
								sw: 'Je, unataka kutuma taarifa ya barua pepe kiotomatiki kwa mtumiaji ikiwa atafuta usajili wake?',
								th: 'คุณต้องการส่งอีเมลล์แจ้งเตือนอัตโนมัติให้ผู้ใช้หากเขายกเลิกการลงทะเบียน?',
								zh: '如果用户取消注册，您是否希望向用户发送自动电子邮件通知？'
							});
						}
					},
					send_followup_email: {
						label: () => {
							return t(locale, {
								en: 'Send follow-up email',
								ja: 'フォローアップメールを送信',
								pt: 'Enviar e-mail de acompanhamento',
								es: 'Enviar correo electrónico de seguimiento',
								fr: 'Envoyer un e-mail de suivi',
								sw: 'Tuma barua pepe ya kufuatilia',
								th: 'ส่งอีเมลล์ติดตาม',
								zh: '发送后续电子邮件'
							});
						},
						description: () => {
							return t(locale, {
								en: 'Do you want to send an automatic email notification to the user after the event?',
								ja: 'イベント後にユーザーに自動的なメール通知を送信しますか？',
								pt: 'Você deseja enviar uma notificação por e-mail automática para o usuário após o evento?',
								es: '¿Desea enviar una notificación por correo electrónico automática al usuario después del evento?',
								fr: 'Souhaitez-vous envoyer une notification par e-mail automatique à l’utilisateur après l’événement?',
								sw: 'Je, unataka kutuma taarifa ya barua pepe kiotomatiki kwa mtumiaji baada ya tukio?',
								th: 'คุณต้องการส่งอีเมลล์แจ้งเตือนอัตโนมัติให้ผู้ใช้หลังจากกิจกรรม?',
								zh: '您是否希望在活动结束后向用户发送自动电子邮件通知？'
							});
						},
						sent: (time_ago: string) => {
							return t(locale, {
								en: `Sent ${time_ago}`,
								ja: `${time_ago} 送信済み`,
								pt: `Enviado ${time_ago}`,
								es: `Enviado ${time_ago}`,
								fr: `Envoyé ${time_ago}`,
								sw: `Imetumwa ${time_ago}`,
								th: `ส่ง ${time_ago}`,
								zh: `发送 ${time_ago}`
							});
						},
						hours_after_end: {
							label: () => {
								return t(locale, {
									en: 'How many hours after the event ends should the follow-up email be sent?',
									ja: 'イベントが終了した後何時間後にフォローアップメールを送信しますか？',
									pt: 'Quantas horas após o término do evento o e-mail de acompanhamento deve ser enviado?',
									es: '¿Cuántas horas después de que finalice el evento se debe enviar el correo electrónico de seguimiento?',
									fr: "Combien d'heures après la fin de l'événement le courriel de suivi doit-il être envoyé?",
									sw: 'Masaa mangapi baada ya tukio kuisha barua pepe ya kufuatilia itumwe?',
									th: 'กี่ชั่วโมงหลังจากกิจกรรมจบควรส่งอีเมลล์ติดตาม?',
									zh: '活动结束后多少小时应发送后续电子邮件？'
								});
							}
						}
					}
				}
			},
			settings: {
				language: {
					choose_language: {
						label: () => {
							return t(locale, {
								en: 'Choose language',
								ja: '言語を選択',
								pt: 'Escolha o idioma',
								es: 'Elegir idioma',
								fr: 'Choisir la langue',
								sw: 'Chagua lugha',
								th: 'เลือกภาษา',
								zh: '选择语言'
							});
						}
					}
				},
				website: {
					custom_domain: {
						label: () => {
							return t(locale, {
								en: 'Custom Domain',
								ja: 'カスタムドメイン',
								pt: 'Domínio Personalizado',
								es: 'Dominio Personalizado',
								fr: 'Domaine Personnalisé',
								sw: 'Kikoa cha Kipekee',
								th: 'โดเมนที่กำหนดเอง',
								zh: '自定义域名'
							});
						},
						description: () => {
							return t(locale, {
								en: 'Enter a custom subdomain that will be accessed by your users. For details on how to set up a custom domain, see our documentation.',
								ja: 'ユーザーがアクセスするカスタムサブドメインを入力してください。カスタムドメインの設定方法の詳細については、ドキュメントを参照してください。',
								pt: 'Digite um subdomínio personalizado que será acessado por seus usuários. Para obter detalhes sobre como configurar um domínio personalizado, consulte nossa documentação.',
								es: 'Ingrese un subdominio personalizado al que accederán sus usuarios. Para obtener detalles sobre cómo configurar un dominio personalizado, consulte nuestra documentación.',
								fr: 'Entrez un sous-domaine personnalisé qui sera accessible par vos utilisateurs. Pour plus de détails sur la configuration d’un domaine personnalisé, consultez notre documentation.',
								sw: 'Ingiza kikoa cha kipekee ambacho kitatumika na watumiaji wako. Kwa maelezo kuhusu jinsi ya kuweka kikoa cha kipekee, angalia nyaraka zetu.',
								th: 'ป้อนโดเมนย่อยที่กำหนดเองที่ผู้ใช้ของคุณจะเข้าถึง สำหรับรายละเอียดเกี่ยวกับวิธีตั้งค่าโดเมนที่กำหนดเอง ดูเอกสารของเรา',
								zh: '输入用户将访问的自定义子域。有关如何设置自定义域的详细信息，请参阅我们的文档。'
							});
						}
					},
					logo: {
						label: () => {
							return t(locale, {
								en: 'Logo',
								ja: 'ロゴ',
								pt: 'Logotipo',
								es: 'Logotipo',
								fr: 'Logo',
								sw: 'Alama',
								th: 'โลโก้',
								zh: '商标'
							});
						},
						description: () => {
							return t(locale, {
								en: 'The logo for your organization. Ideally, this should be at least 500px wide by 100px tall, and in PNG or SVG format. It will be displayed in the header of your website.',
								ja: '組織のロゴです。理想的には、幅500px、高さ100px以上で、PNGまたはSVG形式であるべきです。ウェブサイトのヘッダーに表示されます。',
								pt: 'O logotipo da sua organização. Idealmente, ele deve ter pelo menos 500px de largura por 100px de altura, e no formato PNG ou SVG. Ele será exibido no cabeçalho do seu site.',
								es: 'El logotipo de su organización. Idealmente, debe tener al menos 500px de ancho por 100px de alto, y en formato PNG o SVG. Se mostrará en el encabezado de su sitio web.',
								fr: 'Le logo de votre organisation. Idéalement, il devrait mesurer au moins 500px de large par 100px de haut, et être au format PNG ou SVG. Il sera affiché dans l’en-tête de votre site Web.',
								sw: 'Alama ya shirika lako. Kwa kawaida, hii inapaswa kuwa angalau upana wa 500px kwa urefu wa 100px, na katika muundo wa PNG au SVG. Itaonyeshwa kwenye kichwa cha tovuti yako.',
								th: 'โลโก้สำหรับองค์กรของคุณ อย่างไรก็ตาม ควรมีความกว้างอย่างน้อย 500px โดย 100px สูง และในรูปแบบ PNG หรือ SVG จะแสดงในส่วนหัวของเว็บไซต์ของคุณ',
								zh: '您的组织标志。理想情况下，宽度至少为 500px，高度为 100px，并且为 PNG 或 SVG 格式。它将显示在您网站的页眉中。'
							});
						}
					},
					favicon: {
						label: () => {
							return t(locale, {
								en: 'Favicon',
								ja: 'ファビコン',
								pt: 'Favicon',
								es: 'Favicon',
								fr: 'Favicon',
								sw: 'Favicon',
								th: 'ไอคอนเว็บ',
								zh: '网站图标'
							});
						},
						description: () => {
							return t(locale, {
								en: 'A small icon or logo that represents your organization. It will be displayed in the browser tab when users visit your website. Should be square and at least 50x50 pixels',
								ja: '組織を表す小さなアイコンです。ユーザーがウェブサイトを訪れると、ブラウザのタブに表示されます。',
								pt: 'Um pequeno ícone que representa sua organização. Ele será exibido na guia do navegador quando os usuários visitarem seu site.',
								es: 'Un pequeño icono que representa a su organización. Se mostrará en la pestaña del navegador cuando los usuarios visiten su sitio web.',
								fr: 'Une petite icône qui représente votre organisation. Il sera affiché dans l’onglet du navigateur lorsque les utilisateurs visitent votre site Web.',
								sw: 'Alama ndogo inayowakilisha shirika lako. Itaonyeshwa kwenye kichupo cha kivinjari wakati watumiaji wanapozuru tovuti yako.',
								th: 'ไอคอนขนาดเล็กที่แสดงถึงองค์กรของคุณ จะแสดงในแท็บของเบราว์เซอร์เมื่อผู้ใช้เข้าชมเว็บไซต์ของคุณ',
								zh: '代表您的组织的小图标。当用户访问您的网站时，它将显示在浏览器选项卡中。'
							});
						}
					},
					header_links: {
						title: () => {
							return t(locale, {
								en: 'Header Links',
								ja: 'ヘッダーリンク',
								pt: 'Links do Cabeçalho',
								es: 'Enlaces del Encabezado',
								fr: 'Liens de l’En-tête',
								sw: 'Viungo vya Kichwa',
								th: 'ลิงก์ด้านบน',
								zh: '页眉链接'
							});
						},
						description: () => {
							return t(locale, {
								en: 'Links that will be displayed in the header of your website.',
								ja: 'ウェブサイトのヘッダーに表示されるリンクです。',
								pt: 'Links que serão exibidos no cabeçalho do seu site.',
								es: 'Enlaces que se mostrarán en el encabezado de su sitio web.',
								fr: 'Liens qui seront affichés dans l’en-tête de votre site Web.',
								sw: 'Viungo ambavyo vitaonyeshwa kwenye kichwa cha tovuti yako.',
								th: 'ลิงก์ที่จะแสดงในส่วนหัวของเว็บไซต์ของคุณ',
								zh: '将显示在您网站页眉中的链接。'
							});
						}
					},
					open_in_new_tab: {
						label: () => {
							return t(locale, {
								en: 'Open in new tab',
								ja: '新しいタブで開く',
								pt: 'Abrir em nova aba',
								es: 'Abrir en una nueva pestaña',
								fr: 'Ouvrir dans un nouvel onglet',
								sw: 'Fungua kwenye kichupo kipya',
								th: 'เปิดในแท็บใหม่',
								zh: '在新标签页中打开'
							});
						},
						description: () => {
							return t(locale, {
								en: 'Should the link open in a new tab?',
								ja: 'リンクは新しいタブで開きますか？',
								pt: 'O link deve abrir em uma nova aba?',
								es: '¿El enlace debe abrirse en una nueva pestaña?',
								fr: 'Le lien doit-il s’ouvrir dans un nouvel onglet?',
								sw: 'Je, kiungo kifunguliwe kwenye kichupo kipya?',
								th: 'ควรเปิดลิงก์ในแท็บใหม่หรือไม่?',
								zh: '链接是否应在新标签页中打开？'
							});
						}
					},
					add_link: {
						label: () => {
							return t(locale, {
								en: 'Add a link',
								ja: 'リンクを追加',
								pt: 'Adicionar um link',
								es: 'Agregar un enlace',
								fr: 'Ajouter un lien',
								sw: 'Ongeza kiungo',
								th: 'เพิ่มลิงก์',
								zh: '添加链接'
							});
						}
					},
					footer_links: {
						title: () => {
							return t(locale, {
								en: 'Footer Links',
								ja: 'フッターリンク',
								pt: 'Links do Rodapé',
								es: 'Enlaces del Pie de Página',
								fr: 'Liens du Pied de Page',
								sw: 'Viungo vya Chini',
								th: 'ลิงก์ด้านล่าง',
								zh: '页脚链接'
							});
						},
						description: () => {
							return t(locale, {
								en: 'Links that will be displayed in the footer of your website.',
								ja: 'ウェブサイトのフッターに表示されるリンクです。',
								pt: 'Links que serão exibidos no rodapé do seu site.',
								es: 'Enlaces que se mostrarán en el pie de página de su sitio web.',
								fr: 'Liens qui seront affichés dans le pied de page de votre site Web.',
								sw: 'Viungo ambavyo vitaonyeshwa kwenye chini ya tovuti yako.',
								th: 'ลิงก์ที่จะแสดงในส่วนท้ายของเว็บไซต์ของคุณ',
								zh: '将显示在您网站页脚中的链接。'
							});
						}
					}
				}
			},
			admins: {
				point_person: () => {
					return t(locale, {
						en: 'Point Person',
						ja: '担当者',
						pt: 'Pessoa de Contato',
						es: 'Persona de Contacto',
						fr: 'Personne de Contact',
						sw: 'Mtu wa Mawasiliano',
						th: 'คนติดต่อ',
						zh: '联系人'
					});
				},
				profile_picture_url: () => {
					return t(locale, {
						en: 'Profile Picture URL',
						ja: 'プロフィール写真のURL',
						pt: 'URL da Foto de Perfil',
						es: 'URL de la Foto de Perfil',
						fr: 'URL de la Photo de Profil',
						sw: 'URL ya Picha ya Wasifu',
						th: 'URL รูปภาพโปรไฟล์',
						zh: '个人资料图片 URL'
					});
				},
				filter_admins: () => {
					return t(locale, {
						en: 'Filter Admins',
						ja: '管理者をフィルター',
						pt: 'Filtrar Administradores',
						es: 'Filtrar Administradores',
						fr: 'Filtrer les Administrateurs',
						sw: 'Chuja Wasimamizi',
						th: 'ตัวกรองผู้ดูแลระบบ',
						zh: '筛选管理员'
					});
				}
			},
			tags: {
				add_a_tag: {
					label: () => {
						return t(locale, {
							en: 'Add a tag',
							ja: 'タグを追加',
							pt: 'Adicionar uma tag',
							es: 'Agregar una etiqueta',
							fr: 'Ajouter une étiquette',
							sw: 'Ongeza lebo',
							th: 'เพิ่มแท็ก',
							zh: '添加标签'
						});
					}
				},
				filter_by_tag: {
					placeholder: () => {
						return t(locale, {
							en: 'Filter by tag',
							ja: 'タグでフィルター',
							pt: 'Filtrar por tag',
							es: 'Filtrar por etiqueta',
							fr: 'Filtrer par étiquette',
							sw: 'Chuja kwa lebo',
							th: 'ตัวกรองตามแท็ก',
							zh: '按标签筛选'
						});
					}
				},
				filter_tags: {
					label: () => {
						return t(locale, {
							en: 'Filter tags',
							ja: 'タグをフィルター',
							pt: 'Filtrar tags',
							es: 'Filtrar etiquetas',
							fr: 'Filtrer les étiquettes',
							sw: 'Chuja lebo',
							th: 'ตัวกรองแท็ก',
							zh: '筛选标签'
						});
					}
				}
			},
			filters: {
				boolean_logic: {
					AND: () => {
						return t(locale, {
							en: 'Match all',
							ja: 'すべて一致',
							pt: 'Corresponder a todos',
							es: 'Coincidir con todos',
							fr: 'Correspondre à tous',
							sw: 'Mechi zote',
							th: 'ตรงกับทั้งหมด',
							zh: '匹配所有'
						});
					},
					OR: () => {
						return t(locale, {
							en: 'Match any',
							ja: 'いずれか一致',
							pt: 'Corresponder a qualquer',
							es: 'Coincidir con cualquier',
							fr: "Correspondre à n'importe lequel",
							sw: 'Mechi yoyote',
							th: 'ตรงกับใดๆ',
							zh: '匹配任何'
						});
					},
					NOT: () => {
						return t(locale, {
							en: 'Exclude',
							ja: '除外',
							pt: 'Excluir',
							es: 'Excluir',
							fr: 'Exclure',
							sw: 'Toa',
							th: 'ยกเว้น',
							zh: '排除'
						});
					}
				},
				filter_action: () => {
					return t(locale, {
						en: 'Filter',
						ja: 'フィルター',
						pt: 'Filtrar',
						es: 'Filtrar',
						fr: 'Filtrer',
						sw: 'Chuja',
						th: 'กรอง',
						zh: '筛选'
					});
				},
				create_list_action: () => {
					return t(locale, {
						en: 'Create list',
						ja: 'リストを作成',
						pt: 'Criar lista',
						es: 'Crear lista',
						fr: 'Créer une liste',
						sw: 'Unda orodha',
						th: 'สร้างรายการ',
						zh: '创建列表'
					});
				},
				filter_type: {
					placeholder: () => {
						return t(locale, {
							en: 'Filter type',
							ja: 'フィルタータイプ',
							pt: 'Tipo de filtro',
							es: 'Tipo de filtro',
							fr: 'Type de filtre',
							sw: 'Aina ya kichuja',
							th: 'ประเภทตัวกรอง',
							zh: '筛选类型'
						});
					}
				},
				allow_partial_match: {
					label: () => {
						return t(locale, {
							en: 'Allow partial match',
							ja: '部分一致を許可',
							pt: 'Permitir correspondência parcial',
							es: 'Permitir coincidencia parcial',
							fr: 'Autoriser la correspondance partielle',
							sw: 'Ruhusu mechi ya sehemu',
							th: 'อนุญาตให้ตรงบางส่วน',
							zh: '允许部分匹配'
						});
					}
				},
				must_be_subscribed: {
					label: () => {
						return t(locale, {
							en: 'Must be subscribed',
							ja: '購読する必要があります',
							pt: 'Deve estar inscrito',
							es: 'Debe estar suscrito',
							fr: 'Doit être abonné',
							sw: 'Lazima ujisajili',
							th: 'ต้องสมัครสมาชิก',
							zh: '必须订阅'
						});
					}
				},
				must_have_whatsapp: {
					label: () => {
						return t(locale, {
							en: 'Must have WhatsApp',
							ja: 'WhatsAppが必要です',
							pt: 'Deve ter WhatsApp',
							es: 'Debe tener WhatsApp',
							fr: 'Doit avoir WhatsApp',
							sw: 'Lazima uwe na WhatsApp',
							th: 'ต้องมี WhatsApp',
							zh: '必须有 WhatsApp'
						});
					}
				}
			},
			petitions: {
				petition_title: {
					label: () => {
						return t(locale, {
							en: 'Petition title'
						});
					}
				},
				petition_page_link: {
					label: () => {
						return t(locale, {
							en: 'Petition page link'
						});
					}
				},
				petition_details: {
					label: () => {
						return t(locale, {
							en: 'Petition Details'
						});
					},
					description: () => {
						return t(locale, {
							en: "Details about the petition. This will be displayed on the petition's page"
						});
					}
				},
				petition_target: {
					label: () => {
						return t(locale, {
							en: 'Petition Target',
							ja: '請願対象',
							pt: 'Alvo da Petição',
							es: 'Objetivo de la Petición',
							fr: 'Cible de la Pétition',
							sw: 'Lengo la Ombi',
							th: 'เป้าหมายของการยื่นคำร้อง',
							zh: '请愿目标'
						});
					},
					description: () => {
						return t(locale, {
							en: 'The target of the petition, eg: "To the President..."',
							ja: '請願の対象、例：「大統領へ...」',
							pt: 'Alvo da petição, por exemplo: "Para o Presidente..."',
							es: 'El objetivo de la petición, por ejemplo: "Al Presidente..."',
							fr: 'La cible de la pétition, par exemple: "Au Président..."',
							sw: 'Lengo la ombi, mfano: "Kwa Raisi..."',
							th: 'เป้าหมายของการยื่นคำร้อง เช่น: "ถึงประธานาธิบดี..."',
							zh: '请愿目标，例如：“致总统…”'
						});
					}
				},
				petition_text: {
					label: () => {
						return t(locale, {
							en: 'Petition Text',
							ja: '請願文',
							pt: 'Texto da Petição',
							es: 'Texto de la Petición',
							fr: 'Texte de la Pétition',
							sw: 'Maandishi ya Ombi',
							th: 'ข้อความของการยื่นคำร้อง',
							zh: '请愿文本'
						});
					},
					description: () => {
						return t(locale, {
							en: 'The text of the petition',
							ja: '請願のテキスト',
							pt: 'O texto da petição',
							es: 'El texto de la petición',
							fr: 'Le texte de la pétition',
							sw: 'Maandishi ya ombi',
							th: 'ข้อความของการยื่นคำร้อง',
							zh: '请愿文本'
						});
					}
				}
			},
			website: {
				page_link: {
					label: () => {
						return t(locale, {
							en: 'Page link'
						});
					}
				}
			},
			communications: {
				whatsapp: {
					send_message: {
						placeholder: () => {
							return t(locale, {
								en: '[On tap send messagee]',
								ja: '[タップしてメッセージを送信]',
								pt: '[Toque para enviar mensagem]',
								es: '[Toque para enviar mensaje]',
								fr: '[Appuyez pour envoyer un message]',
								sw: '[Gusa kutuma ujumbe]',
								th: '[แตะเพื่อส่งข้อความ]',
								zh: '[点击发送消息]'
							});
						},
						choose_list_to_send: () => {
							return t(locale, {
								en: 'Choose a list to send to',
								ja: 'このメッセージを送信するリストを選択',
								pt: 'Escolha uma lista para enviar esta mensagem',
								es: 'Elija una lista para enviar este mensaje',
								fr: 'Choisissez une liste pour envoyer ce message',
								sw: 'Chagua orodha kutuma ujumbe huu',
								th: 'เลือกรายการเพื่อส่งข้อความนี้',
								zh: '选择要发送此消息的列表'
							});
						}
					},
					message_edit_form: {
						add_button: () => {
							return t(locale, {
								en: 'Add button',
								ja: 'ボタンを追加',
								pt: 'Adicionar botão',
								es: 'Agregar botón',
								fr: 'Ajouter un bouton',
								sw: 'Ongeza kitufe',
								th: 'เพิ่มปุ่ม',
								zh: '添加按钮'
							});
						},
						delete_button_confirm: () => {
							return t(locale, {
								en: 'Are you sure you want to delete this button?',
								ja: 'このボタンを削除してもよろしいですか？',
								pt: 'Tem certeza de que deseja excluir este botão?',
								es: '¿Está seguro de que desea eliminar este botón?',
								fr: 'Êtes-vous sûr de vouloir supprimer ce bouton?',
								sw: 'Je, una uhakika unataka kufuta kitufe hiki?',
								th: 'คุณแน่ใจหรือว่าต้องการลบปุ่มนี้?',
								zh: '您确定要删除此按钮吗？'
							});
						}
					}
				},
				generic: {
					select_list: {
						label: () => {
							return t(locale, {
								en: 'Select list to send to',
								ja: '送信するリストを選択',
								pt: 'Selecione a lista para enviar',
								es: 'Seleccione la lista para enviar',
								fr: 'Sélectionnez la liste à envoyer',
								sw: 'Chagua orodha ya kutuma',
								th: 'เลือกรายการที่จะส่งไป',
								zh: '选择要发送的列表'
							});
						}
					},
					select_recipients_and_send: () => {
						return t(locale, {
							en: 'Select recipients and send',
							ja: '受信者を選択して送信',
							pt: 'Selecione os destinatários e envie',
							es: 'Seleccione destinatarios y envíe',
							fr: 'Sélectionner les destinataires et envoyer',
							sw: 'Chagua wapokeaji na tuma',
							th: 'เลือกผู้รับและส่ง',
							zh: '选择收件人并发送'
						});
					},
					send_to_a_list: {
						label: () => {
							return t(locale, {
								en: 'Send to a list',
								ja: 'リストに送信',
								pt: 'Enviar para uma lista',
								es: 'Enviar a una lista',
								fr: 'Envoyer à une liste',
								sw: 'Tuma kwa orodha',
								th: 'ส่งไปยังรายการ',
								zh: '发送到列表'
							});
						}
					}
				}
			}
		},
		buttons: {
			select: () => {
				return t(locale, {
					en: 'Select',
					ja: '選択',
					pt: 'Selecionar',
					es: 'Seleccionar',
					fr: 'Sélectionner',
					sw: 'Chagua',
					th: 'เลือก',
					zh: '选择'
				});
			},
			post: () => {
				return t(locale, {
					en: 'Post',
					ja: '投稿',
					pt: 'Postar',
					es: 'Publicar',
					fr: 'Publier',
					sw: 'Chapisha',
					th: 'โพสต์',
					zh: '发布'
				});
			},
			submit: () => {
				return t(locale, {
					en: 'Submit',
					ja: '提出する',
					pt: 'Enviar',
					es: 'Enviar',
					fr: 'Soumettre',
					sw: 'Tuma',
					th: 'เสนอ',
					zh: '提交'
				});
			},
			new: () => {
				return t(locale, {
					en: 'New',
					ja: '新規',
					pt: 'Novo',
					es: 'Nuevo',
					fr: 'Nouveau',
					sw: 'Mpya',
					th: 'ใหม่',
					zh: '新'
				});
			},
			done: () => {
				return t(locale, {
					en: 'Done',
					ja: '完了',
					pt: 'Concluído',
					es: 'Hecho',
					fr: 'Terminé',
					sw: 'Imekamilika',
					th: 'เสร็จแล้ว',
					zh: '完成'
				});
			},
			send: () => {
				return t(locale, {
					en: 'Send',
					ja: '送信',
					pt: 'Enviar',
					es: 'Enviar',
					fr: 'Envoyer',
					sw: 'Tuma',
					th: 'ส่ง',
					zh: '发送'
				});
			},
			update: () => {
				return t(locale, {
					en: 'Update',
					ja: '更新',
					pt: 'Atualizar',
					es: 'Actualizar',
					fr: 'Mettre à jour',
					sw: 'Boresha',
					th: 'อัปเดต',
					zh: '更新'
				});
			},
			remove: () => {
				return t(locale, {
					en: 'Remove'
				});
			},
			toggle: () => {
				return t(locale, {
					en: 'Toggle',
					ja: 'トグル',
					pt: 'Alternar',
					es: 'Alternar',
					fr: 'Basculer',
					sw: 'Badilisha',
					th: 'สลับ',
					zh: '切换'
				});
			},
			create: () => {
				return t(locale, {
					en: 'Create',
					ja: '作成',
					pt: 'Criar',
					es: 'Crear',
					fr: 'Créer',
					sw: 'Unda',
					th: 'สร้าง',
					zh: '创建'
				});
			},
			save: () => {
				return t(locale, {
					en: 'Save',
					ja: '保存',
					pt: 'Salvar',
					es: 'Guardar',
					fr: 'Sauvegarder',
					sw: 'Hifadhi',
					th: 'บันทึก',
					zh: '保存'
				});
			},
			cancel: () => {
				return t(locale, {
					en: 'Cancel',
					ja: 'キャンセル',
					pt: 'Cancelar',
					es: 'Cancelar',
					fr: 'Annuler',
					sw: 'Ghairi',
					th: 'ยกเลิก',
					zh: '取消'
				});
			},
			back: () => {
				return t(locale, {
					en: 'Back',
					ja: '戻る',
					pt: 'Voltar',
					es: 'Volver',
					fr: 'Retour',
					sw: 'Nyuma',
					th: 'กลับ',
					zh: '返回'
				});
			},
			edit: () => {
				return t(locale, {
					en: 'Edit',
					ja: '編集',
					pt: 'Editar',
					es: 'Editar',
					fr: 'Modifier',
					sw: 'Hariri',
					th: 'แก้ไข',
					zh: '编辑'
				});
			},
			edit_name: () => {
				return t(locale, {
					en: 'Edit name',
					ja: '名前を編集',
					pt: 'Editar nome',
					es: 'Editar nombre',
					fr: 'Modifier le nom',
					sw: 'Hariri jina',
					th: 'แก้ไขชื่อ',
					zh: '编辑名称'
				});
			},
			advanced_settings: () => {
				return t(locale, {
					en: 'Advanced settings'
				});
			},
			notification_settings: () => {
				return t(locale, {
					en: 'Notification settings'
				});
			},
			view: () => {
				return t(locale, {
					en: 'View',
					ja: 'ビュー',
					pt: 'Visualizar',
					es: 'Ver',
					fr: 'Voir',
					sw: 'Tazama',
					th: 'ดู',
					zh: '查看'
				});
			},
			preview: () => {
				return t(locale, {
					en: 'Preview',
					ja: 'プレビュー',
					pt: 'Visualização',
					es: 'Vista previa',
					fr: 'Aperçu',
					sw: 'Onesha',
					th: 'ดูตัวอย่าง',
					zh: '预览'
				});
			},
			search_lists: () => {
				return t(locale, {
					en: 'Search lists',
					ja: 'リストを検索',
					pt: 'Pesquisar listas',
					es: 'Buscar listas',
					fr: 'Rechercher des listes',
					sw: 'Tafuta orodha',
					th: 'ค้นหารายการ',
					zh: '搜索列表'
				});
			},
			search_people: () => {
				return t(locale, {
					en: 'Search people',
					ja: '人を検索',
					pt: 'Procurar pessoas',
					es: 'Buscar personas',
					fr: 'Rechercher des personnes',
					sw: 'Tafuta watu',
					th: 'ค้นหาคน',
					zh: '搜索人员'
				});
			},
			copy_url_to_clipboard: () => {
				return t(locale, {
					en: 'Copy URL to clipboard',
					ja: 'URLをクリップボードにコピー',
					pt: 'Copiar URL para a área de transferência',
					es: 'Copiar URL al portapapeles',
					fr: 'Copier l’URL dans le presse-papiers',
					sw: 'Nakili URL kwenye ubao',
					th: 'คัดลอก URL ไปยังคลิปบอร์ด',
					zh: '复制 URL 到剪贴板'
				});
			},
			search: () => {
				return t(locale, {
					en: 'Search',
					ja: '検索',
					pt: 'Pesquisar',
					es: 'Buscar',
					fr: 'Rechercher',
					sw: 'Tafuta',
					th: 'ค้นหา',
					zh: '搜索'
				});
			},
			delete: () => {
				return t(locale, {
					en: 'Delete',
					ja: '削除',
					pt: 'Excluir',
					es: 'Eliminar',
					fr: 'Supprimer',
					sw: 'Futa',
					th: 'ลบ',
					zh: '删除'
				});
			},
			filters: {
				add_filter: () => {
					return t(locale, {
						en: 'Add filter',
						ja: 'フィルターを追加',
						pt: 'Adicionar filtro',
						es: 'Agregar filtro',
						fr: 'Ajouter un filtre',
						sw: 'Ongeza kichuja',
						th: 'เพิ่มตัวกรอง',
						zh: '添加筛选器'
					});
				},
				add_group: () => {
					return t(locale, {
						en: 'Add group',
						ja: 'グループを追加',
						pt: 'Adicionar grupo',
						es: 'Agregar grupo',
						fr: 'Ajouter un groupe',
						sw: 'Ongeza kikundi',
						th: 'เพิ่มกลุ่ม',
						zh: '添加组'
					});
				}
			},
			see_all: () => {
				return t(locale, {
					en: 'See all',
					ja: 'すべてを見る',
					pt: 'Ver tudo',
					es: 'Ver todo',
					fr: 'Voir tout',
					sw: 'Ona yote',
					th: 'ดูทั้งหมด',
					zh: '查看全部'
				});
			},
			open: () => {
				return t(locale, {
					en: 'Open',
					ja: '開く',
					pt: 'Abrir',
					es: 'Abrir',
					fr: 'Ouvrir',
					sw: 'Fungua',
					th: 'เปิด',
					zh: '打开'
				});
			},
			close: () => {
				return t(locale, {
					en: 'Close',
					ja: '閉じる',
					pt: 'Fechar',
					es: 'Cerrar',
					fr: 'Fermer',
					sw: 'Funga',
					th: 'ปิด',
					zh: '关闭'
				});
			},
			upload: () => {
				return t(locale, {
					en: 'Upload',
					ja: 'アップロード',
					pt: 'Carregar',
					es: 'Subir',
					fr: 'Télécharger',
					sw: 'Pakia',
					th: 'อัปโหลด',
					zh: '上传'
				});
			}
		},
		actions: {
			created: () => {
				return t(locale, {
					en: 'Created successfully',
					ja: '作成しました',
					pt: 'Criado com sucesso',
					es: '¡Creado con éxito',
					fr: 'Créé avec succès',
					sw: 'Imesajiliwa kwa mafanikio',
					th: 'สร้างสำเร็จ',
					zh: '创建成功'
				});
			},
			saved: () => {
				return t(locale, {
					en: 'Saved successfully',
					ja: '保存しました',
					pt: 'Salvo com sucesso',
					es: 'Guardado con éxito',
					fr: 'Enregistré avec succès',
					sw: 'Imehifadhiwa kwa mafanikio',
					th: 'บันทึกสำเร็จ',
					zh: '保存成功'
				});
			},
			updated: () => {
				return t(locale, {
					en: 'Updated successfully',
					ja: '更新しました',
					pt: 'Atualizado com sucesso',
					es: 'Actualizado con éxito',
					fr: 'Mis à jour avec succès',
					sw: 'Imeboreshwa kwa mafanikio',
					th: 'อัปเดตสำเร็จ',
					zh: '更新成功'
				});
			},
			success: () => {
				return t(locale, {
					en: 'Success',
					ja: '成功',
					pt: 'Sucesso',
					es: 'Éxito',
					fr: 'Succès',
					sw: 'Mafanikio',
					th: 'สำเร็จ',
					zh: '成功'
				});
			},
			failed: () => {
				return t(locale, {
					en: 'Failed',
					ja: '失敗',
					pt: 'Falhou',
					es: 'Fallido',
					fr: 'Échoué',
					sw: 'Imeshindwa',
					th: 'ล้มเหลว',
					zh: '失败'
				});
			},
			foundResults: (count: number) => {
				return t(locale, {
					en: `Found ${count} result${count === 1 ? '' : 's'}`,
					ja: `${count} 件の結果が見つかりました`,
					pt: `Encontrados ${count} resultado${count === 1 ? '' : 's'}`,
					es: `Se encontraron ${count} resultado${count === 1 ? '' : 's'}`,
					fr: `Trouvé ${count} résultat${count === 1 ? '' : 's'}`,
					sw: `Imepata matokeo ${count}`,
					th: `พบ ${count} รายการ`,
					zh: `找到 ${count} 个结果`
				});
			},
			deleted: () => {
				return t(locale, {
					en: 'Deleted successfully',
					ja: '削除しました',
					pt: 'Excluído com sucesso',
					es: 'Eliminado con éxito',
					fr: 'Supprimé avec succès',
					sw: 'Imefutwa kwa mafanikio',
					th: 'ลบสำเร็จ',
					zh: '删除成功'
				});
			},
			removed: () => {
				return t(locale, {
					en: 'Removed successfully',
					ja: '削除しました',
					pt: 'Removido com sucesso',
					es: 'Eliminado con éxito',
					fr: 'Supprimé avec succès',
					sw: 'Imeondolewa kwa mafanikio',
					th: 'ลบสำเร็จ',
					zh: '删除成功'
				});
			},
			copied_to_clipboard: () => {
				return t(locale, {
					en: 'Copied to clipboard',
					ja: 'クリップボードにコピーしました',
					pt: 'Copiado para a área de transferência',
					es: 'Copiado al portapapeles',
					fr: 'Copié dans le presse-papiers',
					sw: 'Imenakiliwa kwenye ubao',
					th: 'คัดลอกไปยังคลิปบอร์ด',
					zh: '已复制到剪贴板'
				});
			}
		},
		messages: {
			confirm_delete: () => {
				return t(locale, {
					en: 'Are you sure you want to delete this item?',
					ja: 'この項目を削除してもよろしいですか？',
					pt: 'Tem certeza que deseja excluir este item?',
					es: '¿Está seguro de que desea eliminar este elemento?',
					fr: 'Êtes-vous sûr de vouloir supprimer cet élément?',
					sw: 'Jewekani kwamba unataka kufuta kipengele hili?',
					th: 'คุณแน่ใจหรือว่าคุณต้องการลบรายการนี้?',
					zh: '您确定要删除此项吗？'
				});
			}
		}
	};
}
