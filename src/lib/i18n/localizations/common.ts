import { returnLocalizationString as t, type SL } from '$lib/i18n/index';

export default function (locale: SL) {
	return {
		data: {
			no_items: () => {
				return t(locale, {
					en: `No items found`,
					ja: 'アイテムが見つかりません',
					pt: 'Nenhum item encontrado',
					es: 'No se encontraron elementos',
					fr: 'Aucun élément trouvé',
					sw: 'Hakuna vitu vilivyopatikana',
					th: 'ไม่พบรายการ',
					zh: '找不到任何项目'
				});
			},
			not_found_types: {
				people: () => {
					return t(locale, {
						en: 'No people found',
						ja: '人物が見つかりません',
						pt: 'Nenhuma pessoa encontrada',
						es: 'No se encontraron personas',
						fr: 'Aucune personne trouvée',
						sw: 'Hakuna watu walioonekana',
						th: 'ไม่พบคน',
						zh: '找不到人'
					});
				},
				threads: () => {
					return t(locale, {
						en: 'No threads found',
						ja: 'スレッドが見つかりません',
						pt: 'Nenhuma thread encontrada',
						es: 'No se encontraron hilos',
						fr: 'Aucun fil trouvé',
						sw: 'Hakuna mada iliyopatikana',
						th: 'ไม่พบเธรด',
						zh: '找不到线程'
					});
				},
				sends: () => {
					return t(locale, {
						en: 'No sends found',
						ja: '送信が見つかりません',
						pt: 'Nenhum envio encontrado',
						es: 'No se encontraron envíos',
						fr: 'Aucun envoi trouvé',
						sw: 'Hakuna tuma iliyopatikana',
						th: 'ไม่พบการส่ง',
						zh: '找不到发送'
					});
				},
				events: () => {
					return t(locale, {
						en: 'No events found',
						ja: 'イベントが見つかりません',
						pt: 'Nenhum evento encontrado',
						es: 'No se encontraron eventos',
						fr: 'Aucun événement trouvé',
						sw: 'Hakuna matukio yaliyopatikana',
						th: 'ไม่พบกิจกรรม',
						zh: '找不到任何事件'
					});
				},
				petitions: () => {
					return t(locale, {
						en: 'No petitions found',
						ja: '請願が見つかりません',
						pt: 'Nenhuma petição encontrada',
						es: 'No se encontraron peticiones',
						fr: 'Aucune pétition trouvée',
						sw: 'Hakuna ombi lililopatikana',
						th: 'ไม่พบคำร้อง',
						zh: '找不到请愿书'
					});
				},
				groups: () => {
					return t(locale, {
						en: 'No groups found',
						ja: 'グループが見つかりません',
						pt: 'Nenhum grupo encontrado',
						es: 'No se encontraron grupos',
						fr: 'Aucun groupe trouvé',
						sw: 'Hakuna vikundi vilivyopatikana',
						th: 'ไม่พบกลุ่ม',
						zh: '找不到群组'
					});
				},
				lists: () => {
					return t(locale, {
						en: 'No lists found',
						ja: 'リストが見つかりません',
						pt: 'Nenhuma lista encontrada',
						es: 'No se encontraron listas',
						fr: 'Aucune liste trouvée',
						sw: 'Hakuna orodha iliyopatikana',
						th: 'ไม่พบรายการ',
						zh: '找不到列表'
					});
				},
				content: () => {
					return t(locale, {
						en: 'No content found',
						ja: 'コンテンツが見つかりません',
						pt: 'Nenhum conteúdo encontrado',
						es: 'No se encontró contenido',
						fr: 'Aucun contenu trouvé',
						sw: 'Hakuna yaliyomo yaliyopatikana',
						th: 'ไม่พบเนื้อหา',
						zh: '找不到内容'
					});
				},
				pages: () => {
					return t(locale, {
						en: 'No pages found',
						ja: 'ページが見つかりません',
						pt: 'Nenhuma página encontrada',
						es: 'No se encontraron páginas',
						fr: 'Aucune page trouvée',
						sw: 'Hakuna kurasa zilizopatikana',
						th: 'ไม่พบหน้า',
						zh: '找不到页面'
					});
				}
			},
			no_activity: () => {
				return t(locale, {
					en: 'No activity found',
					ja: 'アクティビティが見つかりません',
					pt: 'Nenhuma atividade encontrada',
					es: 'No se encontró actividad',
					fr: 'Aucune activité trouvée',
					sw: 'Hakuna shughuli iliyopatikana',
					th: 'ไม่พบกิจกรรม',
					zh: '找不到任何活动'
				});
			}
		},
		communications: {
			email_unsubscribed: {
				title: () => {
					return t(locale, {
						en: 'Unsubscribed',
						ja: '購読解除',
						pt: 'Desinscrito',
						es: 'Dado de baja',
						fr: 'Désabonné',
						sw: 'Haujasajiliwa',
						th: 'ยกเลิกการสมัคร',
						zh: '取消订阅'
					});
				},
				description: (email?: string) => {
					return t(locale, {
						en: `The email address <span class="font-bold">${email || 'that you requested'}</span> has been unsubscribed from our mailing list.`,
						ja: `メーリングリストから${email || 'リクエストされた'}メールアドレスが購読解除されました。`,
						pt: `O endereço de e-mail ${email || 'solicitado'} foi cancelado da nossa lista de discussão.`,
						es: `La dirección de correo electrónico ${email || 'solicitada'} ha sido dada de baja de nuestra lista de correo.`,
						fr: `L'adresse e-mail ${email || 'demandée'} a été désabonnée de notre liste de diffusion.`,
						sw: `Anwani ya barua pepe ${email || 'ulioomba'} imeondolewa kutoka kwenye orodha yetu ya barua pepe.`,
						th: `ที่อยู่อีเมล ${email || 'ที่คุณขอ'} ได้ถูกยกเลิกการสมัครจากรายชื่อสมาชิกของเราแล้ว`,
						zh: `您请求的电子邮件地址${email || '已'}已从我们的邮件列表中取消订阅。`
					});
				}
			},
			nouns: {
				template: () => {
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
				}
			}
		},
		status: {
			sending: () => {
				return t(locale, {
					en: 'Sending',
					ja: '送信中',
					pt: 'Enviando',
					es: 'Enviando',
					fr: 'Envoi en cours',
					sw: 'Inatuma',
					th: 'กำลังส่ง',
					zh: '发送中'
				});
			},
			sent: () => {
				return t(locale, {
					en: 'Sent',
					ja: '送信済み',
					pt: 'Enviado',
					es: 'Enviado',
					fr: 'Envoyé',
					sw: 'Imetumwa',
					th: 'ส่งแล้ว',
					zh: '已发送'
				});
			},
			completed: () => {
				return t(locale, {
					en: 'Completed',
					ja: '完了',
					pt: 'Concluído',
					es: 'Completado',
					fr: 'Terminé',
					sw: 'Imekamilika',
					th: 'เสร็จสิ้น',
					zh: '已完成'
				});
			},
			completed_at: (localizedTimeAgo: string) => {
				return t(locale, {
					en: `Completed ${localizedTimeAgo}`,
					ja: `完了 ${localizedTimeAgo}`,
					pt: `Concluído ${localizedTimeAgo}`,
					es: `Completado ${localizedTimeAgo}`,
					fr: `Terminé ${localizedTimeAgo}`,
					sw: `Imekamilika ${localizedTimeAgo}`,
					th: `เสร็จสิ้น ${localizedTimeAgo}`,
					zh: `已完成 ${localizedTimeAgo}`
				});
			},
			active: () => {
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
			},
			inactive: () => {
				return t(locale, {
					en: 'Inactive',
					ja: '非アクティブ',
					pt: 'Inativo',
					es: 'Inactivo',
					fr: 'Inactif',
					sw: 'Haipo',
					th: 'ไม่ได้ใช้งาน',
					zh: '不活跃'
				});
			},
			loading: () => {
				return t(locale, {
					en: 'Loading...',
					ja: '読み込み中...',
					pt: 'Carregando...',
					es: 'Cargando...',
					fr: 'Chargement en cours...',
					sw: 'Inapakia...',
					th: 'กำลังโหลด...',
					zh: '载入中...'
				});
			},
			subscribed: () => {
				return t(locale, {
					en: 'Subscribed',
					ja: '購読済み',
					pt: 'Inscrito',
					es: 'Suscrito',
					fr: 'Abonné',
					sw: 'Amejisajili',
					th: 'สมัครสมาชิกแล้ว',
					zh: '已订阅'
				});
			},
			pending: () => {
				return t(locale, {
					en: 'Pending',
					ja: '保留中',
					pt: 'Pendente',
					es: 'Pendiente',
					fr: 'En attente',
					sw: 'Inasubiri',
					th: 'รอดำเนินการ',
					zh: '待定'
				});
			},
			processing: () => {
				return t(locale, {
					en: 'Processing',
					ja: '処理中',
					pt: 'Processando',
					es: 'Procesando',
					fr: 'En cours de traitement',
					sw: 'Inaprocess',
					th: 'กำลังประมวลผล',
					zh: '处理中'
				});
			},
			complete: () => {
				return t(locale, {
					en: 'Complete',
					ja: '完了',
					pt: 'Completo',
					es: 'Completo',
					fr: 'Terminé',
					sw: 'Imekamilika',
					th: 'เสร็จสิ้น',
					zh: '完成'
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
			}
		},
		actions: {
			search: () => {
				return t(locale, {
					en: 'Search',
					ja: '検索',
					pt: 'Pesquisar',
					es: 'Buscar',
					fr: 'Chercher',
					sw: 'Tafuta',
					th: 'ค้นหา',
					zh: '搜索'
				});
			}
		},
		alerts: {
			heads_up: () => {
				return t(locale, {
					en: 'Heads up',
					ja: 'お知らせ',
					pt: 'Atenção',
					es: 'Atención',
					fr: 'Attention',
					sw: 'Kumbuka',
					th: 'เตือน',
					zh: '注意'
				});
			},
			send_email: () => {
				return t(locale, {
					en: 'Are you sure? Pres OK to send the email.',
					ja: '本当にいいですか？ メールを送信するにはOKを押してください。',
					pt: 'Tem certeza? Pressione OK para enviar o e-mail.',
					es: '¿Estás seguro? Presiona OK para enviar el correo electrónico.',
					fr: "Êtes-vous sûr? Appuyez sur OK pour envoyer l'e-mail.",
					sw: 'Je, uhakika? Bonyeza OK kutuma barua pepe.',
					th: 'แน่ใจหรือไม่? กด OK เพื่อส่งอีเมล',
					zh: '您确定吗？按OK发送电子邮件。'
				});
			},
			send_whatsapp_message: () => {
				return t(locale, {
					en: 'Are you sure? Press OK to send the WhatsApp message.',
					ja: '本当にいいですか？ WhatsAppメッセージを送信するにはOKを押してください。',
					pt: 'Tem certeza? Pressione OK para enviar a mensagem do WhatsApp.',
					es: '¿Estás seguro? Presiona OK para enviar el mensaje de WhatsApp.',
					fr: 'Êtes-vous sûr? Appuyez sur OK pour envoyer le message WhatsApp.',
					sw: 'Je, uhakika? Bonyeza OK kutuma ujumbe wa WhatsApp.',
					th: 'แน่ใจหรือไม่? กด OK เพื่อส่งข้อความ WhatsApp',
					zh: '您确定吗？按OK发送WhatsApp消息。'
				});
			},
			confirmation: () => {
				return t(locale, {
					en: 'Are you sure? Press OK to confirm.',
					ja: '本当にいいですか？ 確認するにはOKを押してください。',
					pt: 'Tem certeza? Pressione OK para confirmar.',
					es: '¿Estás seguro? Presiona OK para confirmar.',
					fr: 'Êtes-vous sûr? Appuyez sur OK pour confirmer.',
					sw: 'Je, uhakika? Bonyeza OK kuthibitisha.',
					th: 'แน่ใจหรือไม่? กด OK เพื่อยืนยัน',
					zh: '您确定吗？按OK确认。'
				});
			}
		}
	};
}
