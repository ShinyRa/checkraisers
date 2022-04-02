class Util {
	public static binaryToBase64Conversion = (data: ArrayBuffer): string => {
		const base64 = window.btoa(
			new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), '')
		);
		return base64;
	};
}
export default Util;
