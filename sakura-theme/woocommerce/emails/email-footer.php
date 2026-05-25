<?php
/**
 * Email Footer - Sakura Theme Custom
 *
 * @package SakuraTheme\WooCommerce\Emails
 * @version 10.7.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
																		</div>
																	</td>
																</tr>
															</table>
															<!-- End Content -->
														</td>
													</tr>
												</table>
												<!-- End Body -->
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td align="center" valign="top">
									<!-- Footer -->
									<table border="0" cellpadding="0" cellspacing="0" width="100%" id="template_footer" role="presentation">
										<tr>
											<td valign="top">
												<table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
													<tr>
														<td colspan="2" valign="middle" id="credit">
															<div class="sakura-footer-info">
																<p style="margin: 0 0 8px; font-size: 14px; color: #C76176; font-weight: 600;">
																	&#127800; Ресторан «Цветение сакуры»
																</p>
																<p style="margin: 0 0 4px;">
																	&#128205; ул. Красина 7/1, ст.м. «Маяковская», Москва
																</p>
																<p style="margin: 0 0 4px;">
																	&#128222; <a href="tel:+79153873651" style="color: #C76176; text-decoration: none;">+7(915)387-36-51</a> | <a href="tel:+79037918585" style="color: #C76176; text-decoration: none;">+7(903)791-85-85</a>
																</p>
																<p style="margin: 0 0 12px;">
																	&#9993; <a href="mailto:office@sakura-restaurant.ru" style="color: #C76176; text-decoration: none;">office@sakura-restaurant.ru</a>
																</p>
																<p style="margin: 12px 0 0; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.06); font-size: 11px; color: #999;">
																	<?php echo wp_kses_post( wpautop( wptexturize( apply_filters( 'woocommerce_email_footer_text', get_option( 'woocommerce_email_footer_text' ) ) ) ) ); ?>
																</p>
															</div>
														</td>
													</tr>
												</table>
											</td>
										</tr>
									</table>
									<!-- End Footer -->
								</td>
							</tr>
						</table>
					</div>
				</td>
				<td><!-- Deliberately empty to support consistent sizing and layout across multiple email clients. --></td>
			</tr>
		</table>
	</body>
</html>
