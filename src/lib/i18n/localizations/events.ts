import { returnLocalizationString as t, type SL } from '$lib/i18n/index';

export default function (locale: SL) {
	return {
		attendees: {
			title: () => {
				return t(locale, {
					en: 'Attendees',
					ja: '参加者',
					pt: 'Participantes',
					es: 'Asistentes',
					fr: 'Participants',
					sw: 'Washiriki',
					th: 'ผู้เข้าร่วม',
					zh: '参加者'
				});
			},
			register: {
				title: () => {
					return t(locale, {
						en: 'Register',
						ja: '登録',
						pt: 'Registrar',
						es: 'Registrar',
						fr: 'Enregistrer',
						sw: 'Jisajili',
						th: 'ลงทะเบียน',
						zh: '注册'
					});
				},
				send_notifications: () => {
					return t(locale, {
						en: 'Send Notifications',
						ja: '通知を送信',
						pt: 'Enviar Notificações',
						es: 'Enviar Notificaciones',
						fr: 'Envoyer des Notifications',
						sw: 'Tuma Arifa',
						th: 'ส่งการแจ้งเตือน',
						zh: '发送通知'
					});
				}
			}
		},
		status: {
			registered: {
				title: () => {
					return t(locale, {
						en: 'Registered',
						ja: '登録済み',
						pt: 'Registrado',
						es: 'Registrado',
						fr: 'Enregistré',
						sw: 'Imesajiliwa',
						th: 'ลงทะเบียนแล้ว',
						zh: '已注册'
					});
				}
			},
			noshow: {
				title: () => {
					return t(locale, {
						en: 'No Show',
						ja: '不参加',
						pt: 'Não Compareceu',
						es: 'No Asistió',
						fr: 'Absent',
						sw: 'Hakutokea',
						th: 'ไม่มา',
						zh: '未出席'
					});
				}
			},
			attended: {
				title: () => {
					return t(locale, {
						en: 'Attended',
						ja: '出席',
						pt: 'Compareceu',
						es: 'Asistió',
						fr: 'Présent',
						sw: 'Alikuja',
						th: 'มา',
						zh: '出席'
					});
				}
			},
			cancelled: {
				title: () => {
					return t(locale, {
						en: 'Cancelled',
						ja: 'キャンセル',
						pt: 'Cancelado',
						es: 'Cancelado',
						fr: 'Annulé',
						sw: 'Imefutwa',
						th: 'ยกเลิก',
						zh: '已取消'
					});
				}
			}
		},
		alerts: {
			start_time_before_end: () => {
				return t(locale, {
					en: 'Please make sure the event start time is before the end time.',
					ja: 'イベントの開始時間が終了時間より前になっていることを確認してください。',
					pt: 'Certifique-se de que a hora de início do evento é anterior à hora de término.',
					es: 'Asegúrese de que la hora de inicio del evento sea anterior a la hora de finalización.',
					fr: "Veuillez vous assurer que l'heure de début de l'événement est antérieure à l'heure de fin.",
					sw: 'Tafadhali hakikisha wakati wa kuanza wa tukio uko kabla ya wakati wa mwisho.',
					th: 'โปรดตรวจสอบให้แน่ใจว่าเวลาเริ่มต้นของกิจกรรมอยู่ก่อนเวลาสิ้นสุด',
					zh: '请确保事件开始时间早于结束时间。'
				});
			}
		}
	};
}
